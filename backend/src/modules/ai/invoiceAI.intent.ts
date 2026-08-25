import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/constants/httpStatus";

type IntentCategory =
  | "create_invoice"
  | "greeting"
  | "vague"
  | "gibberish"
  | "question"
  | "unrelated";

interface IntentResult {
  intent: IntentCategory;
  reason?: string;
}

const MAX_INPUT_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 8000;

const EXAMPLE_PROMPT =
  'Try: "Make invoice for [customer name], [service], [optional discount]"';

const EXAMPLES = [
  "Make invoice for Ritesh, website design",
  "Invoice for Acme Ltd, logo design, 50% discount",
  "Create invoice for John, web development, 10k off",
];

export class InvoiceAIIntentValidator {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";

    if (!this.apiKey) {
      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Groq API key is not configured",
      });
    }

    this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    // NOTE: verify this model identifier is still valid/active on your Groq account.
    this.model = "qwen/qwen3.6-27b";
  }

  async validateIntent(text: string): Promise<void> {
    const trimmed = (text || "").trim();

    // --- Fast, deterministic edge cases (no API call needed) ---
    const fastResult = this.classifyLocally(trimmed);
    if (fastResult) {
      this.throwForIntent(fastResult, trimmed);
      return;
    }

    // --- LLM-based classification for anything ambiguous ---
    let result: IntentResult | null = null;

    try {
      result = await this.classifyWithRetry(trimmed);
    } catch (error) {
      // If the API is unreachable/erroring, fail open rather than blocking
      // legitimate invoice requests, but log for visibility.
      console.error(
        "Intent classification failed, proceeding without it:",
        error,
      );
      return;
    }

    if (!result || result.intent === "create_invoice") {
      return;
    }

    this.throwForIntent(result.intent, trimmed, result.reason);
  }

  /**
   * Cheap local checks that don't need a model call. Keeps latency and
   * cost down for the most common non-invoice inputs.
   */
  private classifyLocally(text: string): IntentCategory | null {
    if (text.length === 0) {
      return "vague";
    }

    if (text.length > MAX_INPUT_LENGTH) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Input is too long (max ${MAX_INPUT_LENGTH} characters). Please shorten your request.`,
      });
    }

    const lower = text.toLowerCase();

    const greetings = ["hi", "hello", "hey", "hola", "namaste", "yo", "sup"];
    if (greetings.includes(lower)) {
      return "greeting";
    }

    // Single word, letters only, no spaces, and not an invoice keyword -> likely gibberish
    const invoiceKeywords = ["invoice", "bill", "charge", "quote", "receipt"];
    const isSingleWord = /^[a-z]{3,}$/.test(lower);
    if (isSingleWord && !invoiceKeywords.some((k) => lower.includes(k))) {
      return "gibberish";
    }

    // ONLY "invoice" / "make invoice" / "bill" alone -> vague
    const bareInvoiceRequest =
      /^(make |create |generate )?(invoice|bill)s?$/.test(lower);
    if (bareInvoiceRequest) {
      return "vague";
    }

    // If text has "for" and more than 2 words, it's likely create_invoice
    // Don't block it, let LLM decide
    return null;
  }

  private async classifyWithRetry(
    text: string,
    attempt = 1,
  ): Promise<IntentResult> {
    try {
      return await this.classifyWithModel(text);
    } catch (error) {
      if (attempt < 2) {
        return this.classifyWithRetry(text, attempt + 1);
      }
      throw error;
    }
  }

  private async classifyWithModel(text: string): Promise<IntentResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are a JSON classification API. Return ONLY valid JSON. No explanations, no markdown, no code blocks.",
            },
            {
              role: "user",
              content: this.buildIntentPrompt(text),
            },
          ],
          temperature: 0,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData?.error?.message || "Groq API error",
        };
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from intent classifier");
      }

      return this.parseIntentResponse(content);
    } finally {
      clearTimeout(timeout);
    }
  }

  private parseIntentResponse(raw: string): IntentResult {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      const intent = String(
        parsed.intent || "",
      ).toLowerCase() as IntentCategory;
      const validIntents: IntentCategory[] = [
        "create_invoice",
        "greeting",
        "vague",
        "gibberish",
        "question",
        "unrelated",
      ];

      if (validIntents.includes(intent)) {
        return { intent, reason: parsed.reason };
      }
    } catch {
      // fall through
    }

    const lower = cleaned.toLowerCase();

    // Check for positive indicators
    if (lower.includes("create_invoice") || lower.includes("yes")) {
      return { intent: "create_invoice" };
    }

    // Check if text clearly has invoice-related words
    if (lower.includes("invoice") || lower.includes("bill")) {
      return { intent: "create_invoice" };
    }

    return { intent: "unrelated" };
  }

  private buildIntentPrompt(text: string): string {
    return `Classify this user message for an invoice-creation assistant: "${text}"

Return ONLY a JSON object, no markdown, no explanations:
{
  "intent": "create_invoice" | "greeting" | "vague" | "gibberish" | "question" | "unrelated",
  "reason": "short reason"
}

Category rules:
- "create_invoice": 
  * Mentions "invoice", "bill", "charge", "create invoice", "make invoice", "generate invoice"
  * OR has "for" followed by a customer name (person or company)
  * OR has customer name + service/product
  * Even if service is missing, if it has "invoice for [name]", it's create_invoice
  * Even if discount/price is missing, still create_invoice

- "greeting": Simple greetings ONLY (hi, hello, hey, etc.)
- "vague": ONLY when text is JUST "invoice" or "make invoice" with nothing else
- "gibberish": Random characters with no words
- "question": Questions with "?" that are clearly not about invoices
- "unrelated": Completely different topic

IMPORTANT:
- If text contains "invoice" or "bill" AND has a customer name after "for", it's ALWAYS "create_invoice"
- If text contains "for [name]" with anything else, it's "create_invoice"
- "make invoice for Ritesh R" → "create_invoice" (customer present, service can be asked later)
- "make invoice for Ritesh R, website with 50% discount" → "create_invoice"

Examples:
- "hi" → {"intent":"greeting"}
- "make invoice" → {"intent":"vague","reason":"missing customer and service"}
- "invoice" → {"intent":"vague","reason":"missing customer and service"}
- "make invoice for Ritesh R" → {"intent":"create_invoice","reason":"has customer name"}
- "invoice for Ritesh, website design" → {"intent":"create_invoice"}
- "make invoice for Ritesh R, website with 50% discount" → {"intent":"create_invoice"}
- "Acme Ltd needs a logo design bill, 50% off" → {"intent":"create_invoice"}
- "what's the weather?" → {"intent":"question"}
- "sjfsljfl" → {"intent":"gibberish"}
- "tell me a joke" → {"intent":"unrelated"}`;
  }

  private throwForIntent(
    intent: IntentCategory,
    originalText: string,
    reason?: string,
  ): never {
    throw new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: this.getMessageForIntent(intent, originalText),
      details: {
        intent,
        reason,
        suggestion: EXAMPLE_PROMPT,
        examples: EXAMPLES,
      },
    });
  }

  private getMessageForIntent(
    intent: IntentCategory,
    originalText: string,
  ): string {
    switch (intent) {
      case "greeting":
        return `Hello! I can help you create invoices. ${EXAMPLE_PROMPT}`;
      case "vague":
        return `I need a bit more detail to create the invoice — at least a customer name and a service. ${EXAMPLE_PROMPT}`;
      case "gibberish":
        return `I didn't understand that. Please provide invoice details like customer name and service. ${EXAMPLE_PROMPT}`;
      case "question":
        return `I can only help with creating invoices, not general questions. ${EXAMPLE_PROMPT}`;
      case "unrelated":
      default:
        return `This doesn't look like an invoice request. ${EXAMPLE_PROMPT}`;
    }
  }
}

export const invoiceAIIntentValidator = new InvoiceAIIntentValidator();
