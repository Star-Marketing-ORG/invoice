import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Assumes AppError exposes `.statusCode` and `.details` — adjust if your
// AppError class shapes errors differently.

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

let invoiceAIIntentValidator: any;

beforeAll(async () => {
  process.env.GROQ_API_KEY = 'test-key';
  const mod = await import('../../modules/ai/invoiceAI.intent');
  invoiceAIIntentValidator = mod.invoiceAIIntentValidator;
});

beforeEach(() => {
  fetchMock.mockReset();
});

function groqResponse(content: string, status = 200) {
  return {
    ok: status < 400,
    status,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

describe('intent validation — local fast paths (no Groq call)', () => {
  it('rejects empty input as vague', async () => {
    await expect(invoiceAIIntentValidator.validateIntent('')).rejects.toMatchObject({
      details: { intent: 'vague' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects input over the length limit', async () => {
    const huge = 'a'.repeat(2001);
    await expect(invoiceAIIntentValidator.validateIntent(huge)).rejects.toThrow(/too long/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('recognizes a bare greeting', async () => {
    await expect(invoiceAIIntentValidator.validateIntent('hi')).rejects.toMatchObject({
      details: { intent: 'greeting' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('recognizes gibberish', async () => {
    await expect(invoiceAIIntentValidator.validateIntent('asdfgh')).rejects.toMatchObject({
      details: { intent: 'gibberish' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('recognizes a bare "invoice" request as vague', async () => {
    await expect(invoiceAIIntentValidator.validateIntent('make invoice')).rejects.toMatchObject({
      details: { intent: 'vague' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('intent validation — Groq-dependent paths', () => {
  it('accepts a valid invoice request', async () => {
    fetchMock.mockResolvedValue(groqResponse('{"intent":"create_invoice"}'));
    await expect(
      invoiceAIIntentValidator.validateIntent('Invoice for Ritesh, website design')
    ).resolves.toBeUndefined();
  });

  it('rejects an unrelated question', async () => {
    fetchMock.mockResolvedValue(
      groqResponse('{"intent":"question","reason":"asks about weather"}')
    );
    await expect(invoiceAIIntentValidator.validateIntent("what's the weather?")).rejects.toMatchObject(
      { details: { intent: 'question' } }
    );
  });

  it('falls back to legacy "yes" text response', async () => {
    fetchMock.mockResolvedValue(groqResponse('yes'));
    await expect(
      invoiceAIIntentValidator.validateIntent('Invoice for Acme, logo design')
    ).resolves.toBeUndefined();
  });

  it('treats unparseable model output as unrelated', async () => {
    fetchMock.mockResolvedValue(groqResponse('I cannot help with that'));
    await expect(invoiceAIIntentValidator.validateIntent('random text here')).rejects.toMatchObject({
      details: { intent: 'unrelated' },
    });
  });

  it('handles a JSON response wrapped in markdown', async () => {
    fetchMock.mockResolvedValue(groqResponse('```json\n{"intent":"create_invoice"}\n```'));
    await expect(
      invoiceAIIntentValidator.validateIntent('Invoice for Ritesh, website design')
    ).resolves.toBeUndefined();
  });

  it('maps a 429 into the retry path and still fails open after exhausting retries', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'rate limited' } }),
    });
    await expect(
      invoiceAIIntentValidator.validateIntent('Invoice for Ritesh, website design')
    ).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2); // initial + 1 retry
  });

  it('fails open (does not block) after retries are exhausted on network error', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    await expect(
      invoiceAIIntentValidator.validateIntent('Invoice for Ritesh, website design')
    ).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2); // initial + 1 retry
  });
});