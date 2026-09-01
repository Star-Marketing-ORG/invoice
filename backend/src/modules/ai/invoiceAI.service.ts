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
  InvoiceContext,
} from "./invoiceAI.types";
import { invoiceService } from "../invoice/invoice.service";
import { invoiceAISuggestions } from "./invoiceAI.suggestions";

export class InvoiceAIService {

  async generateInvoiceFromText(
    text: string,
    userId?: string,
    context?: InvoiceContext,
  ): Promise<GenerateInvoiceAIResponse> {
    let mergedData: ParsedInvoiceData;

    if (context && this.isModificationRequest(text)) {
      mergedData = this.buildFromContext(text, context);
    } else {
      const parsedData = await invoiceAIParser.parseInvoiceText(text);
      mergedData = context
        ? this.mergeWithContext(parsedData, context)
        : parsedData;
    }

    invoiceAIParser.validateParsedData(mergedData);

    const customerResult = await this.findCustomer(mergedData);

    const matchedServices = await this.matchServices(mergedData.items);

    const unmatchedServices = matchedServices.filter(
      (s) => !s.matched || s.suggestions?.length,
    );

    if (unmatchedServices.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "Some services need clarification",
        details: {
          unmatchedServices: unmatchedServices.map((s) => ({
            requested: s.requested,
            message: s.suggestions?.length
              ? `Multiple services found for "${s.requested}". Please select one.`
              : `Service "${s.requested}" not found. Please create it first.`,
          })),
          suggestions: unmatchedServices.map((s) => ({
            requested: s.requested,
            suggestions: s.suggestions || [],
          })),
          actions: unmatchedServices
            .filter((s) => !s.suggestions?.length)
            .map((s) => ({
              type: "CREATE_SERVICE",
              label: `Create service "${s.requested}"`,
            })),
        },
      });
    }

    // Prepare invoice items with discount validation
    const allWarnings: string[] = [...customerResult.warnings];
    
    const invoiceItems = matchedServices.map((service, index) => {
      const parsedItem = mergedData.items[index];
      const dbPrice = service.matched!.unitPrice;
      const dbTaxRate = service.matched!.taxRate;
      const quantity = parsedItem.quantity || 1;

      // Check if discount exceeds price
      if (parsedItem.discountType === 'fixed' && parsedItem.discount > dbPrice * quantity) {
        allWarnings.push(
          `Discount ₹${parsedItem.discount} exceeds service price ₹${dbPrice * quantity} for "${service.matched!.name}". Capped at 100%.`
        );
      }

      if (parsedItem.discountType === 'percentage' && parsedItem.discount > 100) {
        allWarnings.push(
          `Discount ${parsedItem.discount}% exceeds 100% for "${service.matched!.name}". Capped at 100%.`
        );
      }

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
        discount: Math.round(discountPercentage * 100) / 100,
      };
    });

    const invoice = await invoiceService.createInvoice(
      {
        customerId: customerResult.customer.id,
        issueDate: new Date().toISOString(),
        dueDate: mergedData.dueDate,
        notes: mergedData.notes,
        termsConditions: mergedData.termsConditions,
        items: invoiceItems,
      },
      userId,
    );

    return {
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        subtotal: Math.round(Number(invoice.subtotal) * 100) / 100,
        discount: Math.round(Number(invoice.discount) * 100) / 100,
        tax: Math.round(Number(invoice.tax) * 100) / 100,
        total: Math.round(Number(invoice.total) * 100) / 100,
        customer: {
          id: invoice.customer.id,
          name: invoice.customer.name,
          email: invoice.customer.email,
        },
        items: invoice.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Math.round(Number(item.unitPrice) * 100) / 100,
          discount: Math.round(Number(item.discount) * 100) / 100,
          taxRate: Number(item.taxRate),
          total: Math.round(Number(item.total) * 100) / 100,
        })),
      },
      warnings: allWarnings,
    };
  }

  async previewInvoice(
    text: string,
    userId?: string,
    context?: InvoiceContext,
  ): Promise<GenerateInvoiceAIResponse> {
    let mergedData: ParsedInvoiceData;

    if (context && this.isModificationRequest(text)) {
      mergedData = this.buildFromContext(text, context);
    } else {
      const parsedData = await invoiceAIParser.parseInvoiceText(text);
      mergedData = context
        ? this.mergeWithContext(parsedData, context)
        : parsedData;
    }

    invoiceAIParser.validateParsedData(mergedData);

    const customerResult = await this.findCustomer(mergedData);

    const matchedServices = await this.matchServices(mergedData.items);

    const unmatchedServices = matchedServices.filter(
      (s) => !s.matched || s.suggestions?.length,
    );

    if (unmatchedServices.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "Some services need clarification",
        details: {
          unmatchedServices: unmatchedServices.map((s) => ({
            requested: s.requested,
            message: s.suggestions?.length
              ? `Multiple services found for "${s.requested}". Please select one.`
              : `Service "${s.requested}" not found. Please create it first.`,
          })),
          suggestions: unmatchedServices.map((s) => ({
            requested: s.requested,
            suggestions: s.suggestions || [],
          })),
          actions: unmatchedServices
            .filter((s) => !s.suggestions?.length)
            .map((s) => ({
              type: "CREATE_SERVICE",
              label: `Create service "${s.requested}"`,
            })),
        },
      });
    }

    const allWarnings: string[] = [...customerResult.warnings];
    
    const invoiceItems = matchedServices.map((service, index) => {
      const parsedItem = mergedData.items[index];
      const dbPrice = service.matched!.unitPrice;
      const dbTaxRate = service.matched!.taxRate;
      const quantity = parsedItem.quantity || 1;

      if (parsedItem.discountType === 'fixed' && parsedItem.discount > dbPrice * quantity) {
        allWarnings.push(
          `Discount ₹${parsedItem.discount} exceeds service price ₹${dbPrice * quantity} for "${service.matched!.name}". Capped at 100%.`
        );
      }

      if (parsedItem.discountType === 'percentage' && parsedItem.discount > 100) {
        allWarnings.push(
          `Discount ${parsedItem.discount}% exceeds 100% for "${service.matched!.name}". Capped at 100%.`
        );
      }

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
        discount: Math.round(discountPercentage * 100) / 100,
      };
    });

    const totals = FinancialCalculations.calculateTotals(invoiceItems);

    return {
      invoice: {
        id: "",
        invoiceNumber: "",
        status: "DRAFT",
        subtotal: Math.round(totals.subtotal * 100) / 100,
        discount: Math.round(totals.discount * 100) / 100,
        tax: Math.round(totals.tax * 100) / 100,
        total: Math.round(totals.total * 100) / 100,
        customer: {
          id: customerResult.customer.id,
          name: customerResult.customer.name,
          email: customerResult.customer.email,
        },
        items: invoiceItems.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Math.round(Number(item.unitPrice) * 100) / 100,
          discount: Math.round(Number(item.discount) * 100) / 100,
          taxRate: Number(item.taxRate),
          total: Math.round(FinancialCalculations.calculateItemTotal(item) * 100) / 100,
        })),
      },
      warnings: allWarnings,
    };
  }

  async parseTextOnly(
    text: string,
    userId?: string,
    context?: InvoiceContext,
  ): Promise<ParsedInvoiceData> {
    let mergedData: ParsedInvoiceData;

    if (context && this.isModificationRequest(text)) {
      mergedData = this.buildFromContext(text, context);
    } else {
      const parsedData = await invoiceAIParser.parseInvoiceText(text);
      mergedData = context
        ? this.mergeWithContext(parsedData, context)
        : parsedData;
    }

    invoiceAIParser.validateParsedData(mergedData);
    return mergedData;
  }

  private isModificationRequest(text: string): boolean {
    const lower = text.toLowerCase();
    return (
      lower.includes("discount") ||
      lower.includes("off") ||
      lower.includes("add") ||
      lower.includes("update") ||
      lower.includes("change") ||
      lower.includes("remove") ||
      lower.includes("due date") ||
      lower.includes("confirm") ||
      lower.includes("apply")
    );
  }

  private buildFromContext(
    text: string,
    context: InvoiceContext,
  ): ParsedInvoiceData {
    const lower = text.toLowerCase();

    const data: ParsedInvoiceData = {
      customerName: context.customerName || "",
      customerEmail: "",
      customerPhone: "",
      items: (context.services || []).map((service) => ({
        serviceName: service.name,
        description: service.name,
        quantity: service.quantity || 1,
        unitPrice: 0,
        discount: service.discount || 0,
        discountType: service.discountType || "percentage",
        taxRate: 0,
      })),
      dueDate: context.dueDate || "",
      notes: context.notes || "",
      termsConditions: context.termsConditions || "",
    };

    const percentageMatch = lower.match(/(\d+)%\s*(?:off|discount)?/);
    if (percentageMatch) {
      const discount = parseInt(percentageMatch[1]);
      data.items = data.items.map((item) => ({
        ...item,
        discount: discount,
        discountType: "percentage",
      }));
    }

    const fixedMatch = lower.match(/(\d+)\s*k?\s*(?:off|flat)/);
    if (fixedMatch) {
      let amount = parseInt(fixedMatch[1]);
      if (lower.includes("k")) {
        amount *= 1000;
      }
      data.items = data.items.map((item) => ({
        ...item,
        discount: amount,
        discountType: "fixed",
      }));
    }

    if (lower.includes("due")) {
      const today = new Date();
      if (lower.includes("next week")) {
        today.setDate(today.getDate() + 7);
      } else if (lower.includes("tomorrow")) {
        today.setDate(today.getDate() + 1);
      } else if (lower.includes("in 15 days")) {
        today.setDate(today.getDate() + 15);
      } else if (lower.includes("in 30 days")) {
        today.setDate(today.getDate() + 30);
      }
      data.dueDate = today.toISOString().split("T")[0];
    }

    return data;
  }

  private mergeWithContext(
    parsed: ParsedInvoiceData,
    context: InvoiceContext,
  ): ParsedInvoiceData {
    const merged = { ...parsed };

    if (
      (!merged.customerName || merged.customerName.trim() === "") &&
      context.customerName
    ) {
      merged.customerName = context.customerName;
    }

    if (
      (!merged.items || merged.items.length === 0) &&
      context.services?.length
    ) {
      merged.items = context.services.map((service) => ({
        serviceName: service.name,
        description: service.name,
        quantity: service.quantity || 1,
        unitPrice: 0,
        discount: service.discount || 0,
        discountType: service.discountType || "percentage",
        taxRate: 0,
      }));
    }

    if (context.discount && merged.items && merged.items.length > 0) {
      merged.items = merged.items.map((item) => {
        if (!item.discount || item.discount === 0) {
          return {
            ...item,
            discount: context.discount || 0,
            discountType: context.discountType || "percentage",
          };
        }
        return item;
      });
    }

    if (!merged.dueDate && context.dueDate) {
      merged.dueDate = context.dueDate;
    }

    if (!merged.notes && context.notes) {
      merged.notes = context.notes;
    }

    if (!merged.termsConditions && context.termsConditions) {
      merged.termsConditions = context.termsConditions;
    }

    return merged;
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

    const suggestions = await invoiceAISuggestions.suggestCustomers(
      parsedData.customerName,
    );

    if (suggestions.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: `Customer "${parsedData.customerName}" not found. Did you mean one of these?`,
        details: {
          suggestedCustomers: suggestions,
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

    return Promise.all(
      items.map(async (item) => {
        const searchTerm = item.serviceName.toLowerCase().trim();
        const searchWords = searchTerm.split(/[\s-]+/).filter(Boolean);

        // 1. Exact match
        const exactMatch = allServices.find(
          (service) => service.name.toLowerCase() === searchTerm,
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

        // 2. Score ALL services based on word overlap
        const scoredServices = allServices.map((service) => {
          const serviceName = service.name.toLowerCase();
          const serviceWords = serviceName.split(/[\s-]+/).filter(Boolean);
          
          let score = 0;
          
          searchWords.forEach((word) => {
            if (word.length < 3) return;
            
            if (serviceName === word) {
              score += 100;
            } else if (serviceName.includes(word)) {
              score += 50;
            } else if (serviceWords.some((sw) => sw.includes(word))) {
              score += 40;
            }
          });

          const matchedWordsCount = searchWords.filter((word) =>
            serviceName.includes(word),
          ).length;
          
          if (matchedWordsCount > 1) {
            score += matchedWordsCount * 30;
          }

          return { service, score };
        });

        const matchedServices = scoredServices
          .filter((s) => s.score > 0)
          .sort((a, b) => b.score - a.score);

        if (matchedServices.length === 0) {
          const searchSuggestions = await invoiceAISuggestions.suggestServices(
            item.serviceName,
          );
          
          return {
            requested: item.serviceName,
            matched: null,
            confidence: 0,
            suggestions: searchSuggestions,
          };
        }

        const bestMatch = matchedServices[0];
        const secondBest = matchedServices[1];
        
        if (!secondBest || bestMatch.score >= secondBest.score + 30) {
          return {
            requested: item.serviceName,
            matched: {
              id: bestMatch.service.id,
              name: bestMatch.service.name,
              unitPrice: Number(bestMatch.service.price),
              taxRate: Number(bestMatch.service.taxRate),
            },
            confidence: bestMatch.score >= 100 ? 90 : 70,
          };
        }

        return {
          requested: item.serviceName,
          matched: null,
          confidence: 0,
          suggestions: matchedServices.slice(0, 3).map((s) => ({
            id: s.service.id,
            serviceCode: s.service.serviceCode,
            name: s.service.name,
            price: Number(s.service.price),
            taxRate: Number(s.service.taxRate),
            categoryName: s.service.category?.name || null,
          })),
        };
      }),
    );
  }
}

export const invoiceAIService = new InvoiceAIService();