import { prisma } from "../../database/client";
import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/constants/httpStatus";
import { invoiceAIParser } from "./invoiceAI.parser";
import { DiscountUtil } from "../../common/utils/discount.util";
import { FinancialCalculations } from "../../common/calculations/financial-calculations";
import type {
  ParsedInvoiceData,
  ParsedInvoiceItem,
  CustomerMatchResult,
  MatchedService,
  GenerateInvoiceAIResponse,
} from "./invoiceAI.types";
import { invoiceService } from "../invoice/invoice.service";

export class InvoiceAIService {
  async generateInvoiceFromText(
    text: string,
    userId?: string,
  ): Promise<GenerateInvoiceAIResponse> {
    // 1. Parse text with AI
    const parsedData = await invoiceAIParser.parseInvoiceText(text);

    // 2. Validate parsed data
    invoiceAIParser.validateParsedData(parsedData);

    // 3. Find customer (NO auto-create)
    const customerResult = await this.findCustomer(parsedData);

    // 4. Match services (NO auto-create)
    const matchedServices = await this.matchServices(parsedData.items);

    // 5. Check for unmatched services
    const unmatchedServices = matchedServices.filter((s) => !s.matched);

    if (unmatchedServices.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "Some services not found",
        details: {
          unmatchedServices: unmatchedServices.map((s) => ({
            requested: s.requested,
            message: `Service "${s.requested}" not found. Please create it first.`,
          })),
          actions: unmatchedServices.map((s) => ({
            type: "CREATE_SERVICE",
            label: `Create service "${s.requested}"`,
          })),
        },
      });
    }

    // 6. Prepare invoice data - Pass discount as PERCENTAGE to invoice service
    const invoiceItems = matchedServices.map((service, index) => {
      const parsedItem = parsedData.items[index];
      const dbPrice = service.matched!.unitPrice;
      const dbTaxRate = service.matched!.taxRate;
      const quantity = parsedItem.quantity || 1;

      const discountPercentage = DiscountUtil.convertToPercentage(
        parsedItem.discount,
        parsedItem.discountType,
        dbPrice,
        quantity,
      );

      return {
        serviceId: service.matched!.id,
        description: service.matched!.name,
        quantity: quantity,
        unitPrice: dbPrice,
        taxRate: dbTaxRate,
        discount: discountPercentage,
      };
    });

    // 7. Create invoice - Let invoice.service.ts handle all calculations
    const invoice = await invoiceService.createInvoice(
      {
        customerId: customerResult.customer.id,
        issueDate: new Date().toISOString(),
        dueDate: parsedData.dueDate,
        notes: parsedData.notes,
        termsConditions: parsedData.termsConditions,
        items: invoiceItems,
      },
      userId,
    );

    // 8. Return clean response
    return {
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        subtotal: Number(invoice.subtotal),
        discount: Number(invoice.discount),
        tax: Number(invoice.tax),
        total: Number(invoice.total),
        customer: {
          id: invoice.customer.id,
          name: invoice.customer.name,
          email: invoice.customer.email,
        },
        items: invoice.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          taxRate: Number(item.taxRate),
          total: Number(item.total),
        })),
      },
      warnings: customerResult.warnings,
    };
  }

  async previewInvoice(
    text: string,
    userId?: string,
  ): Promise<GenerateInvoiceAIResponse> {
    // 1. Parse text with AI
    const parsedData = await invoiceAIParser.parseInvoiceText(text);

    // 2. Validate parsed data
    invoiceAIParser.validateParsedData(parsedData);

    // 3. Find customer (NO auto-create)
    const customerResult = await this.findCustomer(parsedData);

    // 4. Match services (NO auto-create)
    const matchedServices = await this.matchServices(parsedData.items);

    // 5. Check for unmatched services
    const unmatchedServices = matchedServices.filter((s) => !s.matched);

    if (unmatchedServices.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "Some services not found",
        details: {
          unmatchedServices: unmatchedServices.map((s) => ({
            requested: s.requested,
            message: `Service "${s.requested}" not found. Please create it first.`,
          })),
          actions: unmatchedServices.map((s) => ({
            type: "CREATE_SERVICE",
            label: `Create service "${s.requested}"`,
          })),
        },
      });
    }

    // 6. Prepare invoice items (same as generate)
    const invoiceItems = matchedServices.map((service, index) => {
      const parsedItem = parsedData.items[index];
      const dbPrice = service.matched!.unitPrice;
      const dbTaxRate = service.matched!.taxRate;
      const quantity = parsedItem.quantity || 1;

      const discountPercentage = DiscountUtil.convertToPercentage(
        parsedItem.discount,
        parsedItem.discountType,
        dbPrice,
        quantity,
      );

      return {
        serviceId: service.matched!.id,
        description: service.matched!.name,
        quantity: quantity,
        unitPrice: dbPrice,
        taxRate: dbTaxRate,
        discount: discountPercentage,
      };
    });

    // 7. Calculate totals using FinancialCalculations
    const totals = FinancialCalculations.calculateTotals(invoiceItems);

    // 8. Return preview WITHOUT saving to DB
    return {
      invoice: {
        id: "",
        invoiceNumber: "",
        status: "DRAFT",
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        customer: {
          id: customerResult.customer.id,
          name: customerResult.customer.name,
          email: customerResult.customer.email,
        },
        items: invoiceItems.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          taxRate: Number(item.taxRate),
          total: FinancialCalculations.calculateItemTotal(item),
        })),
      },
      warnings: customerResult.warnings,
    };
  }

  async parseTextOnly(text: string, userId?: string): Promise<ParsedInvoiceData> {
    const parsedData = await invoiceAIParser.parseInvoiceText(text);
    invoiceAIParser.validateParsedData(parsedData);
    return parsedData;
  }

  private async findCustomer(
    parsedData: ParsedInvoiceData,
  ): Promise<CustomerMatchResult> {
    const warnings: string[] = [];

    const orConditions: any[] = [
      { name: { equals: parsedData.customerName, mode: "insensitive" } },
    ];

    if (parsedData.customerEmail) {
      orConditions.push({
        email: { equals: parsedData.customerEmail, mode: "insensitive" },
      });
    }

    if (parsedData.customerPhone) {
      orConditions.push({
        phone: { equals: parsedData.customerPhone },
      });
    }

    const exactCustomer = await prisma.customer.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (exactCustomer) {
      return {
        customer: {
          id: exactCustomer.id,
          name: exactCustomer.name,
          email: exactCustomer.email,
          phone: exactCustomer.phone,
          isNew: false,
        },
        warnings,
      };
    }

    const nameParts = parsedData.customerName.split(" ").filter(Boolean);
    const searchTerm = nameParts[0] || parsedData.customerName;

    const similarCustomers = await prisma.customer.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      take: 5,
    });

    if (similarCustomers.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: `Customer "${parsedData.customerName}" not found. Did you mean one of these?`,
        details: {
          suggestedCustomers: similarCustomers.map((c) => ({
            id: c.id,
            customerCode: c.customerCode,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
          })),
          actions: [
            {
              type: "CREATE_CUSTOMER",
              label: `Create new customer "${parsedData.customerName}"`,
            },
          ],
        },
      });
    }

    throw new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      message: `Customer "${parsedData.customerName}" not found`,
      details: {
        actions: [
          {
            type: "CREATE_CUSTOMER",
            label: `Create new customer "${parsedData.customerName}"`,
          },
        ],
      },
    });
  }

  private async matchServices(
    items: ParsedInvoiceItem[],
  ): Promise<MatchedService[]> {
    const allServices = await prisma.service.findMany({
      include: {
        category: true,
      },
    });

    return items.map((item) => {
      const exactMatch = allServices.find(
        (service) =>
          service.name.toLowerCase() === item.serviceName.toLowerCase(),
      );

      if (exactMatch) {
        return {
          requested: item.serviceName,
          matched: {
            id: exactMatch.id,
            name: exactMatch.name,
            unitPrice: Number(exactMatch.price),
            taxRate: Number(exactMatch.taxRate),
          },
          confidence: 100,
        };
      }

      const fuzzyMatch = allServices.find(
        (service) =>
          service.name.toLowerCase().includes(item.serviceName.toLowerCase()) ||
          item.serviceName.toLowerCase().includes(service.name.toLowerCase()),
      );

      if (fuzzyMatch) {
        return {
          requested: item.serviceName,
          matched: {
            id: fuzzyMatch.id,
            name: fuzzyMatch.name,
            unitPrice: Number(fuzzyMatch.price),
            taxRate: Number(fuzzyMatch.taxRate),
          },
          confidence: 70,
        };
      }

      const keywords = item.serviceName
        .toLowerCase()
        .split(/[\s-]+/)
        .filter(Boolean);
      const keywordMatch = allServices.find((service) => {
        const serviceName = service.name.toLowerCase();
        const categoryName = service.category?.name.toLowerCase() || "";
        return keywords.some(
          (keyword) =>
            keyword.length > 2 &&
            (serviceName.includes(keyword) || categoryName.includes(keyword)),
        );
      });

      if (keywordMatch) {
        return {
          requested: item.serviceName,
          matched: {
            id: keywordMatch.id,
            name: keywordMatch.name,
            unitPrice: Number(keywordMatch.price),
            taxRate: Number(keywordMatch.taxRate),
          },
          confidence: 50,
        };
      }

      return {
        requested: item.serviceName,
        matched: null,
        confidence: 0,
      };
    });
  }
}

export const invoiceAIService = new InvoiceAIService();