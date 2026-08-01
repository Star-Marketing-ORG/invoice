import { notificationRepository } from "./notification.repository";
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPE } from "./notification.constants";
import { CreateNotificationDto, NotificationQueryParams } from "./notification.types";
import { Pagination } from "../../common/utils/pagination";
import { Prisma, Notification } from "@prisma/client";

export class NotificationService {
  async getAllNotifications(query: NotificationQueryParams) {
    const where: Prisma.NotificationWhereInput = {};

    if (query.entity) {
      where.entity = query.entity as any;
    }

    if (query.isRead === "true") {
      where.isRead = true;
    } else if (query.isRead === "false") {
      where.isRead = false;
    }

    const result = await Pagination.paginate<Notification>(
      (args) =>
        notificationRepository.findMany({
          ...args,
          where,
        }),
      {
        cursor: query.cursor,
        limit: query.limit ? parseInt(query.limit) : undefined,
      },
    );

    const unreadCount = await notificationRepository.getUnreadCount();
    const total = await notificationRepository.count({ where });

    return {
      notifications: result.data,
      unreadCount,
      total,
    };
  }

  async getUnreadCount() {
    const count = await notificationRepository.getUnreadCount();
    return { count };
  }

  async markAsRead(id: string) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notificationRepository.markAsRead(id);
  }

  async markAllAsRead() {
    const result = await notificationRepository.markAllAsRead();
    return { updatedCount: result.count };
  }

 async createNotification(data: CreateNotificationDto) {
    const existing = await notificationRepository.findExistingNotification(
      data.type,
      data.entity,
      data.invoiceId,
      data.quotationId,
    );


    if (existing) {
      return existing;
    }

    return notificationRepository.create(data);
  }

  async createInvoiceDueNotification(
    invoiceId: string,
    invoiceNumber: string,
    type: "DUE_IN_TWO_DAYS" | "DUE_TOMORROW" | "DUE_TODAY" | "DUE_NOW",
  ) {
    const messageMap = {
      DUE_IN_TWO_DAYS: NOTIFICATION_MESSAGES.INVOICE.DUE_IN_TWO_DAYS(invoiceNumber),
      DUE_TOMORROW: NOTIFICATION_MESSAGES.INVOICE.DUE_TOMORROW(invoiceNumber),
      DUE_TODAY: NOTIFICATION_MESSAGES.INVOICE.DUE_TODAY(invoiceNumber),
      DUE_NOW: NOTIFICATION_MESSAGES.INVOICE.DUE_NOW(invoiceNumber),
    };

    return this.createNotification({
      type,
      entity: "INVOICE",
      message: messageMap[type],
      invoiceId,
    });
  }

  async createQuotationExpiryNotification(
    quotationId: string,
    quotationNumber: string,
    type: "DUE_IN_TWO_DAYS" | "DUE_TOMORROW" | "DUE_TODAY" | "EXPIRED",
  ) {
    const messageMap = {
      DUE_IN_TWO_DAYS: NOTIFICATION_MESSAGES.QUOTATION.DUE_IN_TWO_DAYS(quotationNumber),
      DUE_TOMORROW: NOTIFICATION_MESSAGES.QUOTATION.DUE_TOMORROW(quotationNumber),
      DUE_TODAY: NOTIFICATION_MESSAGES.QUOTATION.DUE_TODAY(quotationNumber),
      EXPIRED: NOTIFICATION_MESSAGES.QUOTATION.EXPIRED(quotationNumber),
    };

    return this.createNotification({
      type,
      entity: "QUOTATION",
      message: messageMap[type],
      quotationId,
    });
  }


  async deleteAllNotifications() {
    const result = await notificationRepository.deleteAll();
    return { deletedCount: result.count };
  }
}

export const notificationService = new NotificationService();