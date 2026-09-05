import type { InvoiceAIPreview, InvoiceContext } from "@invoice/shared/types";
import axiosInstance from "../../utils/axios";

/**
 * Fix vs the original: this file used to import InvoiceAIPreview and
 * InvoiceContext from "@invoice/shared/types" and then re-declare
 * `export interface InvoiceAIPreview { ... }` (and CustomerSuggestion,
 * AIAction, AIErrorDetails) three separate times further down the file -
 * a duplicate-identifier error that also conflicts directly with the
 * import. All type definitions now live in exactly one place
 * (@invoice/shared/types, see invoiceAI.types.ts) and this file only
 * imports them.
 */

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequest {
  text: string;
  context?: InvoiceContext;
  history?: ConversationTurn[];
}

export const invoiceAIApi = {
  preview: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice/test-parse", data)
      .then((res) => res.data),

  generate: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice/generate", data)
      .then((res) => res.data),
};
