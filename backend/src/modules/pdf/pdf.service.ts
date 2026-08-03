import { InvoicePdfData, PdfType, SendPdfResult } from "./pdf.types";
import { generateInvoicePdf } from "./pdf.template";
import { emailService } from "../email/email.service";
import { logger } from "../../config/logger";

// Simple in-memory cache
const pdfCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

class PdfService {
  private getCacheKey(id: string, type: PdfType): string {
    return `${type}_${id}`;
  }

  private getFromCache(id: string, type: PdfType): Buffer | null {
    const key = this.getCacheKey(id, type);
    const cached = pdfCache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      logger.info(`PDF cache hit for ${type} ${id}`);
      return cached.buffer;
    }

    if (cached) {
      pdfCache.delete(key);
    }

    return null;
  }

  private setCache(id: string, type: PdfType, buffer: Buffer): void {
    const key = this.getCacheKey(id, type);
    pdfCache.set(key, { buffer, timestamp: Date.now() });
    logger.info(`PDF cached for ${type} ${id}`);
  }

  async generatePdf(
    data: InvoicePdfData,
    id: string,
    type: PdfType,
  ): Promise<Buffer> {
    const cached = this.getFromCache(id, type);
    if (cached) {
      return cached;
    }

    const pdfBuffer = await generateInvoicePdf(data, type);
    this.setCache(id, type, pdfBuffer);

    return pdfBuffer;
  }

  async sendPdf(
    invoiceData: InvoicePdfData,
    id: string,
    type: PdfType,
  ): Promise<SendPdfResult> {
    try {
      const pdfBuffer = await this.generatePdf(invoiceData, id, type);

      // Send email in background
      emailService
        .sendInvoicePdf({
          to: invoiceData.customerEmail,
          customerName: invoiceData.customerName,
          invoiceNumber: invoiceData.invoiceNumber,
          total: invoiceData.total.toLocaleString("en-IN"),
          remainingBalance:
            invoiceData.remainingBalance.toLocaleString("en-IN"),
          dueDate: invoiceData.dueDate,
          pdfBuffer: pdfBuffer,
          type: type,
        })
        .then((sent) => {
          if (sent) {
            logger.info(`${type} PDF sent to ${invoiceData.customerEmail}`);
          }
        });

      return { success: true, message: `${type} PDF is being sent` };
    } catch (error) {
      logger.error(`Error sending ${type} PDF:`, error);
      return { success: false, message: `Error generating ${type} PDF` };
    }
  }

  clearCache(id?: string, type?: PdfType): void {
    if (id && type) {
      pdfCache.delete(this.getCacheKey(id, type));
    } else {
      pdfCache.clear();
    }
  }
}

export const pdfService = new PdfService();
