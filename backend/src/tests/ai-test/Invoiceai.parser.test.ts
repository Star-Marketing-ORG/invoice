import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Assumes AppError exposes `.statusCode` and `.message` — adjust if your
// AppError class shapes errors differently.
//
// IMPORTANT: this file lives at src/tests/ai-test/, while the source lives
// at src/modules/ai/. vi.mock() resolves its path relative to THIS file,
// so it must match that path exactly — otherwise Vitest mocks a module
// nobody imports and the real implementation runs instead.

const validateIntentMock = vi.fn().mockResolvedValue(undefined);

vi.mock('../../modules/ai/invoiceAI.intent', () => ({
  invoiceAIIntentValidator: { validateIntent: validateIntentMock },
}));

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

let InvoiceAIParser: any;
let parser: any;

function groqResponse(content: string, status = 200) {
  return {
    ok: status < 400,
    status,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

const VALID_INVOICE_JSON = JSON.stringify({
  customerName: 'Ritesh',
  customerEmail: '',
  customerPhone: '',
  items: [
    { serviceName: 'website', description: '', quantity: 1, unitPrice: 10000, discount: 0, discountType: 'percentage', taxRate: 0 },
  ],
  dueDate: '',
  notes: '',
  termsConditions: '',
});

beforeAll(async () => {
  process.env.GROQ_API_KEY = 'test-key';
  const mod = await import('../../modules/ai/invoiceAI.parser');
  InvoiceAIParser = mod.InvoiceAIParser;
});

beforeEach(() => {
  fetchMock.mockReset();
  validateIntentMock.mockReset().mockResolvedValue(undefined);
  parser = new InvoiceAIParser();
});

describe('parseInvoiceText — input guards (no fetch call)', () => {
  it('rejects empty text', async () => {
    await expect(parser.parseInvoiceText('')).rejects.toThrow(/provide invoice text/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects text over the length limit', async () => {
    await expect(parser.parseInvoiceText('a'.repeat(2001))).rejects.toThrow(/too long/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('propagates a rejected intent check without calling the AI', async () => {
    validateIntentMock.mockRejectedValue(new Error('not an invoice request'));
    await expect(parser.parseInvoiceText('hi')).rejects.toThrow(/not an invoice request/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('parseInvoiceText — happy path & response cleanup', () => {
  it('parses a clean JSON response', async () => {
    fetchMock.mockResolvedValue(groqResponse(VALID_INVOICE_JSON));
    const result = await parser.parseInvoiceText('Invoice for Ritesh, website, 10k');
    expect(result.customerName).toBe('Ritesh');
    expect(result.items[0].unitPrice).toBe(10000);
  });

  it('extracts JSON even when wrapped in markdown/prose', async () => {
    fetchMock.mockResolvedValue(groqResponse(`Sure, here you go:\n\`\`\`json\n${VALID_INVOICE_JSON}\n\`\`\``));
    const result = await parser.parseInvoiceText('Invoice for Ritesh, website, 10k');
    expect(result.customerName).toBe('Ritesh');
  });

  it('self-repairs once when the first response is invalid JSON', async () => {
    fetchMock
      .mockResolvedValueOnce(groqResponse('not json at all'))
      .mockResolvedValueOnce(groqResponse(VALID_INVOICE_JSON));
    const result = await parser.parseInvoiceText('Invoice for Ritesh, website, 10k');
    expect(result.customerName).toBe('Ritesh');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws if both the original and repair attempt return invalid JSON', async () => {
    fetchMock
      .mockResolvedValueOnce(groqResponse('garbage'))
      .mockResolvedValueOnce(groqResponse('still garbage'));
    await expect(parser.parseInvoiceText('Invoice for Ritesh, website')).rejects.toThrow(
      /could not be parsed/i
    );
  });
});

describe('parseInvoiceText — API error handling', () => {
  it('maps a 429 to a rate-limit message', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'rate limited' } }),
    });
    await expect(parser.parseInvoiceText('Invoice for Ritesh, website')).rejects.toThrow(
      /rate limit/i
    );
  });

  it('maps a generic non-ok response to a failure message', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: 'server error' } }),
    });
    await expect(parser.parseInvoiceText('Invoice for Ritesh, website')).rejects.toThrow(
      /failed to parse/i
    );
  });

  it('maps an aborted/timed-out request to a timeout message', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    fetchMock.mockRejectedValue(abortError);
    await expect(parser.parseInvoiceText('Invoice for Ritesh, website')).rejects.toThrow(
      /timed out/i
    );
  });
});

describe('validateParsedData', () => {
  const baseItem = {
    serviceName: 'website',
    quantity: 1,
    unitPrice: 10000,
    discount: 0,
    discountType: 'percentage' as const,
    taxRate: 0,
  };

  it('throws when customerName is missing', () => {
    expect(() => parser.validateParsedData({ customerName: '', items: [baseItem] })).toThrow(
      /customer name/i
    );
  });

  it('throws when items is empty', () => {
    expect(() => parser.validateParsedData({ customerName: 'Ritesh', items: [] })).toThrow(
      /any services/i
    );
  });

  it('throws when a service name is missing, naming the item index', () => {
    expect(() =>
      parser.validateParsedData({
        customerName: 'Ritesh',
        items: [{ ...baseItem, serviceName: '' }],
      })
    ).toThrow(/item 1/i);
  });

  it('defaults an invalid quantity to 1', () => {
    const data = { customerName: 'Ritesh', items: [{ ...baseItem, quantity: -5 }] };
    parser.validateParsedData(data);
    expect(data.items[0].quantity).toBe(1);
  });

  it('defaults an invalid discountType to percentage', () => {
    const data = { customerName: 'Ritesh', items: [{ ...baseItem, discountType: 'bogus' }] };
    parser.validateParsedData(data);
    expect(data.items[0].discountType).toBe('percentage');
  });

  it('rejects a percentage discount over 100', () => {
    const data = { customerName: 'Ritesh', items: [{ ...baseItem, discount: 150 }] };
    expect(() => parser.validateParsedData(data)).toThrow(/can't exceed 100%/);
  });

  it('rejects a fixed discount larger than the item total', () => {
    const data = {
      customerName: 'Ritesh',
      items: [{ ...baseItem, discountType: 'fixed', discount: 999999 }],
    };
    expect(() => parser.validateParsedData(data)).toThrow(/can't exceed the item total/);
  });
});