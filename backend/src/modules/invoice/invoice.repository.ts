import { prisma } from "../../database/client";

export class InvoiceRepository {
  async findMany() {
    return prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        quotation: true,
        items: {
          include: {
            service: true,
          },
        },
        payments: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        quotation: true,
        items: {
          include: {
            service: true,
          },
        },
        payments: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findByInvoiceNumber(invoiceNumber: string) {
    return prisma.invoice.findUnique({
      where: { invoiceNumber },
    });
  }

  async create(data: {
    invoiceNumber: string;
    customerId: string;
    quotationId?: string;
    issueDate?: Date;
    dueDate?: Date;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    status: string;
    isFromQuotation?: boolean;
    notes?: string;
    termsConditions?: string;
    createdById?: string;
    items: {
      serviceId: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      discount: number;
      total: number;
    }[];
  }) {
    return prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        customerId: data.customerId,
        quotationId: data.quotationId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        status: data.status as any,
        notes: data.notes,
        termsConditions: data.termsConditions,
        createdById: data.createdById,
        isFromQuotation: data.isFromQuotation,
        items: {
          create: data.items,
        },
      },
      include: {
        customer: true,
        quotation: true,
        items: {
          include: {
            service: true,
          },
        },
        payments: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      customerId?: string;
      quotationId?: string;
      issueDate?: Date;
      dueDate?: Date;
      subtotal?: number;
      discount?: number;
      tax?: number;
      total?: number;
      status?: string;
      notes?: string;
      termsConditions?: string;
      items?: {
        serviceId: string;
        description?: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        discount: number;
        total: number;
      }[];
    },
  ) {
    if (data.items) {
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        customerId: data.customerId,
        quotationId: data.quotationId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        status: data.status as any,
        notes: data.notes,
        termsConditions: data.termsConditions,
        ...(data.items && {
          items: {
            create: data.items,
          },
        }),
      },
      include: {
        customer: true,
        quotation: true,
        items: {
          include: {
            service: true,
          },
        },
        payments: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.invoice.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.invoice.count();
  }

  async search(args: any) {
    return prisma.invoice.findMany({
      ...args,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: true,
        quotation: {
          select: {
            id: true,
            quotationNumber: true,
          },
        },
      },
    });
  }

  async filter(args: any) {
    return prisma.invoice.findMany({
      ...args,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        quotation: {
          select: {
            id: true,
            quotationNumber: true,
          },
        },
        items: true,
        payments: true,
      },
    });
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date) {
    const where: any = {
      status: "PAID",
    };

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = startDate;
      if (endDate) where.issueDate.lte = endDate;
    }

    const result = await prisma.invoice.aggregate({
      where,
      _sum: { total: true },
    });

    return Number(result._sum.total) || 0;
  }

  async getOutstandingTotal(startDate?: Date, endDate?: Date) {
    const where: any = {
      status: { in: ["SENT", "OVERDUE"] },
    };

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = startDate;
      if (endDate) where.issueDate.lte = endDate;
    }

    const result = await prisma.invoice.aggregate({
      where,
      _sum: { total: true },
    });

    return Number(result._sum.total) || 0;
  }

  async getOverdueCount(startDate?: Date, endDate?: Date) {
    const where: any = {
      status: "OVERDUE",
    };

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = startDate;
      if (endDate) where.issueDate.lte = endDate;
    }

    return prisma.invoice.count({ where });
  }

  async getTotalCount(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = startDate;
      if (endDate) where.issueDate.lte = endDate;
    }

    return prisma.invoice.count({ where });
  }

  async getCountThisMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return prisma.invoice.count({
      where: {
        issueDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  }

  async getMonthlyRevenue(startDate: Date, endDate: Date) {
    const result = await prisma.invoice.aggregate({
      where: {
        status: "PAID",
        issueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { total: true },
    });

    return Number(result._sum.total) || 0;
  }

  async getStatusBreakdown() {
    const statuses = ["PAID", "SENT", "OVERDUE", "DRAFT", "CANCELLED"];

    const result = await Promise.all(
      statuses.map(async (status) => {
        const count = await prisma.invoice.count({
          where: { status: status as any },
        });
        return { status, count };
      }),
    );

    return result;
  }

  async getServiceDemandStats() {
    const result = await prisma.invoiceItem.groupBy({
      by: ["serviceId"],
      _count: {
        serviceId: true,
      },
      orderBy: {
        _count: {
          serviceId: "desc",
        },
      },
      take: 5,
    });

    const servicesWithNames = await Promise.all(
      result.map(async (item) => {
        const service = await prisma.service.findUnique({
          where: { id: item.serviceId },
          select: { name: true },
        });
        return {
          name: service?.name || "Unknown",
          count: item._count.serviceId,
        };
      }),
    );

    const maxCount = servicesWithNames[0]?.count || 1;
    return servicesWithNames.map((s) => ({
      ...s,
      percent: Math.round((s.count / maxCount) * 100),
    }));
  }

  async markEmailDueReminderSent(invoiceId: string) {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        emailDueReminderSent: true,
      },
    });
  }

  async markEmailOverdueSent(invoiceId: string) {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        emailOverdueSent: true,
      },
    });
  }

  async findInvoicesForDueReminder() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    return prisma.invoice.findMany({
      where: {
        status: {
          notIn: ["PAID", "CANCELLED", "OVERDUE"],
        },
        dueDate: {
          not: null,
        },
        emailDueReminderSent: false, // Only get invoices where email NOT sent
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findInvoicesForOverdueEmail() {
    return prisma.invoice.findMany({
      where: {
        status: {
          notIn: ["PAID", "CANCELLED"],
        },
        dueDate: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        emailOverdueSent: false,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

}

export const invoiceRepository = new InvoiceRepository();
