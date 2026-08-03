export type PdfType = "invoice" | "quotation";

export interface InvoicePdfData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  status: string;
  items: {
    serviceName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  totalPaid: number;
  remainingBalance: number;
  notes?: string;
  termsConditions?: string;
}

export interface SendPdfResult {
  success: boolean;
  message: string;
}