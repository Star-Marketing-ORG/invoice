import axiosInstance from "../../utils/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface InvoiceAIPreview {
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    customer: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      taxRate: number;
      total: number;
    }>;
  };
  warnings: string[];
}

export interface InvoiceAIGenerateResponse extends InvoiceAIPreview {}

export const invoiceAIApi = {
  preview: (text: string) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice/test-parse", { text })
      .then((res) => res.data),

  generate: (text: string) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIGenerateResponse>>("/invoice/generate", { text })
      .then((res) => res.data),
};