import { prisma } from "../../database/client";
import { Prisma } from "@prisma/client";

export class NotificationRepository {
  async findMany(args?: {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
    take?: number;
    skip?: number;
    cursor?: Prisma.NotificationWhereUniqueInput;
  }) {
    return prisma.notification.findMany({
      ...args,
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            total: true,
            dueDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        quotation: {
          select: {
            quotationNumber: true,
            total: true,
            expiryDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: args?.orderBy || { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            total: true,
            dueDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        quotation: {
          select: {
            quotationNumber: true,
            total: true,
            expiryDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    type: string;
    entity: string;
    message: string;
    invoiceId?: string;
    quotationId?: string;
  }) {
    return prisma.notification.create({
      data: {
        type: data.type as any,
        entity: data.entity as any,
        message: data.message,
        invoiceId: data.invoiceId || null,
        quotationId: data.quotationId || null,
      },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            total: true,
            dueDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        quotation: {
          select: {
            quotationNumber: true,
            total: true,
            expiryDate: true,
            status: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount() {
    return prisma.notification.count({
      where: { isRead: false },
    });
  }

  async count(args?: { where?: Prisma.NotificationWhereInput }) {
    return prisma.notification.count(args);
  }

  async deleteAll() {
    return prisma.notification.deleteMany({});
  }

  async findExistingNotification(
    type: string,
    entity: string,
    invoiceId?: string,
    quotationId?: string,
  ) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: any = {
      type: type as any,
      entity: entity as any,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    };

    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    if (quotationId) {
      where.quotationId = quotationId;
    }

    return prisma.notification.findFirst({ where });
  }
}

export const notificationRepository = new NotificationRepository();
