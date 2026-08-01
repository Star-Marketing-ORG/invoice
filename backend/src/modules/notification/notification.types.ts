export interface CreateNotificationDto {
  type:
    | "DUE_IN_TWO_DAYS"
    | "DUE_TOMORROW"
    | "DUE_TODAY"
    | "DUE_NOW"
    | "EXPIRED";
  entity: "INVOICE" | "QUOTATION";
  message: string;
  invoiceId?: string;
  quotationId?: string;
}

export interface NotificationQueryParams {
  entity?: "INVOICE" | "QUOTATION";
  isRead?: string;
  cursor?: string;
  limit?: string;
}

export interface NotificationResponse {
  id: string;
  type: string;
  entity: string;
  message: string;
  isRead: boolean;
  invoiceId: string | null;
  invoice: {
    invoiceNumber: string;
    total: string;
    dueDate: Date;
    status: string;
    customer: {
      name: string;
      email: string;
    };
  } | null;
  quotationId: string | null;
  quotation: {
    quotationNumber: string;
    total: string;
    expiryDate: Date;
    status: string;
    customer: {
      name: string;
      email: string;
    };
  } | null;
  createdAt: Date;
  readAt: Date | null;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  unreadCount: number;
  total: number;
}
