export const NOTIFICATION_MESSAGES = {
  INVOICE: {
    DUE_IN_TWO_DAYS: (invoiceNumber: string) => 
      `Invoice #${invoiceNumber} is due in 2 days.`,
    DUE_TOMORROW: (invoiceNumber: string) => 
      `Invoice #${invoiceNumber} is due tomorrow.`,
    DUE_TODAY: (invoiceNumber: string) => 
      `Invoice #${invoiceNumber} is due today.`,
    DUE_NOW: (invoiceNumber: string) => 
      `Invoice #${invoiceNumber} is overdue.`,
  },
  QUOTATION: {
    DUE_IN_TWO_DAYS: (quotationNumber: string) => 
      `Quotation #${quotationNumber} expires in 2 days.`,
    DUE_TOMORROW: (quotationNumber: string) => 
      `Quotation #${quotationNumber} expires tomorrow.`,
    DUE_TODAY: (quotationNumber: string) => 
      `Quotation #${quotationNumber} expires today.`,
    EXPIRED: (quotationNumber: string) => 
      `Quotation #${quotationNumber} has expired.`,
  },
};

export const NOTIFICATION_TYPE = {
  DUE_IN_TWO_DAYS: "DUE_IN_TWO_DAYS",
  DUE_TOMORROW: "DUE_TOMORROW",
  DUE_TODAY: "DUE_TODAY",
  DUE_NOW: "DUE_NOW",
  EXPIRED: "EXPIRED",
} as const;

export const NOTIFICATION_ENTITY = {
  INVOICE: "INVOICE",
  QUOTATION: "QUOTATION",
} as const;