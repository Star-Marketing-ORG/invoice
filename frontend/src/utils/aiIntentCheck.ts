export type IntentResult = {
  isValid: boolean;
  errorMessage?: string;
};

const EXAMPLE_PROMPT =
  'Try: "Make invoice for [customer name], [service], [optional discount]"';

export function checkAIIntent(text: string): IntentResult {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Empty
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: "Please type something to create an invoice.",
    };
  }

  // Too long
  if (trimmed.length > 2000) {
    return {
      isValid: false,
      errorMessage: "Input is too long. Please shorten your request.",
    };
  }

  // Greetings
  const greetings = ["hi", "hello", "hey", "hola", "namaste", "yo", "sup"];
  if (greetings.includes(lower)) {
    return {
      isValid: false,
      errorMessage: `Hello! I can help you create invoices. ${EXAMPLE_PROMPT}`,
    };
  }

  // Single word gibberish
  const invoiceKeywords = ["invoice", "bill", "charge", "quote", "receipt"];
  const isSingleWord = /^[a-z]{3,}$/.test(lower);
  if (isSingleWord && !invoiceKeywords.some((k) => lower.includes(k))) {
    return {
      isValid: false,
      errorMessage: `I didn't understand that. Please provide invoice details like customer name and service. ${EXAMPLE_PROMPT}`,
    };
  }

  // Bare invoice request
  const bareInvoiceRequest =
    /^(make |create |generate )?(invoice|bill)s?$/.test(lower);
  if (bareInvoiceRequest) {
    return {
      isValid: false,
      errorMessage: `I need a bit more detail to create the invoice — at least a customer name and a service. ${EXAMPLE_PROMPT}`,
    };
  }

  // Question
  if (lower.includes("?")) {
    return {
      isValid: false,
      errorMessage: `I can only help with creating invoices, not general questions. ${EXAMPLE_PROMPT}`,
    };
  }

  // Valid
  return { isValid: true };
}