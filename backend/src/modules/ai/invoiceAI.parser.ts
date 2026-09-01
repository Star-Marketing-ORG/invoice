import type { ParsedInvoiceData, ParsedInvoiceItem } from './invoiceAI.types';
import { AppError } from '../../common/errors/AppError';
import { HTTP_STATUS } from '../../common/constants/httpStatus';
import { invoiceAIIntentValidator } from './invoiceAI.intent';

const MAX_INPUT_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 10000;

export class InvoiceAIParser {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';

    if (!this.apiKey) {
      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Groq API key is not configured',
      });
    }

    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    // NOTE: verify this model identifier is still valid/active on your Groq account.
    this.model = 'qwen/qwen3.6-27b';
  }

  async parseInvoiceText(text: string): Promise<ParsedInvoiceData> {
    const trimmed = (text || '').trim();

    if (trimmed.length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Please provide invoice text to parse',
      });
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Invoice text is too long (max ${MAX_INPUT_LENGTH} characters). Please shorten it.`,
      });
    }

    // Check intent first
    await invoiceAIIntentValidator.validateIntent(trimmed);

    try {
      const prompt = this.buildPrompt(trimmed);
      const raw = await this.callGroq(prompt);
      const parsed = await this.parseJSONWithRetry(raw, prompt);
      return parsed;
    } catch (error: any) {
      console.error('Groq parsing error:', error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error.status === 429) {
        throw new AppError({
          statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
          message: 'AI rate limit reached. Please try again later.',
        });
      }

      if (error.name === 'AbortError') {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: 'AI request timed out. Please try again.',
        });
      }

      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Failed to parse invoice text with AI',
      });
    }
  }

  private async callGroq(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a JSON extraction API. Return ONLY valid JSON. No explanations, no markdown, no code blocks.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData?.error?.message || 'Groq API error',
        };
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: 'AI returned an empty response',
        });
      }

      return content;
    } finally {
      clearTimeout(timeout);
    }
  }

 private buildPrompt(text: string): string {
  return `You are an intelligent invoice assistant. Your job is to understand user requests naturally, like a human assistant would.

USER REQUEST: "${text}"

TASK:
Extract invoice details by understanding the user's intent, even if they use casual language, abbreviations, or make mistakes.

EXTRACTION RULES:

**Customer Name:**
- Person names: "Ritesh", "John", "Suresh Kumar"
- Company names: "Acme Ltd", "Tech Corp", "Sun Pharma"
- After "for", "invoice for", "bill to"
- If multiple names, pick the one after "for"

**Service/Product:**
- What the user is selling or charging for
- "website" → this is a service
- "logo design" → this is a service
- "web dev" → web development
- Keep the service name simple and clear

**Discount:**
- "50% off", "50% discount", "50 percent" → discount: 50, discountType: "percentage"
- "10k off", "5000 off", "flat 5000" → discount: 5000, discountType: "fixed"
- "half price" → discount: 50, discountType: "percentage"
- No discount → 0

**Quantity:**
- "2 websites", "two logos" → quantity: 2
- No quantity → 1

**Due Date:**
- "due next week" → calculate from today
- "due 15th August" → YYYY-MM-DD
- No date → ""

**Email/Phone:**
- Look for email patterns and phone numbers
- Extract if present

IMPORTANT:
- Be forgiving with spelling mistakes
- Understand intent, not just keywords
- If user says "fgdh" as service, keep it as "fgdh" (we'll match later)
- Don't invent information
- If unsure about a field, leave it empty

Return ONLY valid JSON:
{
  "customerName": "",
  "customerEmail": "",
  "customerPhone": "",
  "items": [
    {
      "serviceName": "",
      "description": "",
      "quantity": 1,
      "unitPrice": 0,
      "discount": 0,
      "discountType": "percentage",
      "taxRate": 0
    }
  ],
  "dueDate": "",
  "notes": "",
  "termsConditions": ""
}`;
}

  /**
   * Attempts to parse the model's response as JSON. If that fails, asks
   * the model once to correct its own output before giving up.
   */
  private async parseJSONWithRetry(raw: string, originalPrompt: string): Promise<ParsedInvoiceData> {
    try {
      return this.parseJSON(raw);
    } catch (firstError) {
      try {
        const repairPrompt = `Your previous response was not valid JSON. Here is what you returned:\n${raw}\n\nReturn ONLY the corrected, valid JSON object for this request, nothing else:\n${originalPrompt}`;
        const repaired = await this.callGroq(repairPrompt);
        return this.parseJSON(repaired);
      } catch {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: 'AI response could not be parsed as valid invoice data',
        });
      }
    }
  }

  private cleanResponse(text: string): string {
    return text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
  }

  /**
   * Extracts the first balanced {...} block from a string. More reliable
   * than a greedy regex when the model adds stray text around the JSON.
   */
  private extractJSONBlock(text: string): string | null {
    const start = text.indexOf('{');
    if (start === -1) return null;

    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++;
      if (text[i] === '}') depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
    return null;
  }

  private parseJSON(textResponse: string): ParsedInvoiceData {
    const cleaned = this.cleanResponse(textResponse);

    try {
      return JSON.parse(cleaned);
    } catch {
      const block = this.extractJSONBlock(cleaned);

      if (block) {
        try {
          return JSON.parse(block);
        } catch {
          // fall through to error below
        }
      }

      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'AI response does not contain valid JSON',
      });
    }
  }

  validateParsedData(data: ParsedInvoiceData): void {
    if (!data || typeof data !== 'object') {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Could not extract invoice data from text. Try: "Make invoice for [customer], [service name]"',
      });
    }

    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Could not extract customer name from text. Try: "Make invoice for [customer], [service]"',
      });
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Could not extract any services. Try: "Make invoice for [customer], [service name]"',
      });
    }

    data.items.forEach((item: ParsedInvoiceItem, index: number) => {
      const position = index + 1;

      if (!item.serviceName || item.serviceName.trim().length === 0) {
        throw new AppError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: `Item ${position}: service name is missing. Try: "Make invoice for [customer], [service name]"`,
        });
      }

      const quantity = Number(item.quantity);
      item.quantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

      const unitPrice = Number(item.unitPrice);
      item.unitPrice = Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0;

      const discount = Number(item.discount);
      item.discount = Number.isFinite(discount) && discount > 0 ? discount : 0;

      const taxRate = Number(item.taxRate);
      item.taxRate = Number.isFinite(taxRate) && taxRate >= 0 ? taxRate : 0;

      if (item.discountType !== 'percentage' && item.discountType !== 'fixed') {
        item.discountType = 'percentage';
      }

      if (item.discountType === 'percentage' && item.discount > 100) {
        throw new AppError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: `Item ${position}: percentage discount can't exceed 100%.`,
        });
      }

      // if (item.discountType === 'fixed' && item.discount > item.unitPrice * item.quantity) {
      //   throw new AppError({
      //     statusCode: HTTP_STATUS.BAD_REQUEST,
      //     message: `Item ${position}: fixed discount can't exceed the item total.`,
      //   });
      // }
    });
  }
}

export const invoiceAIParser = new InvoiceAIParser();