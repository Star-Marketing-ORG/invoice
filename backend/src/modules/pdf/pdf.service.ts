import { logger } from "src/config/logger";
import { generateInvoicePdf } from "./pdf.template";
import { InvoicePdfData, SendPdfResult } from "./pdf.types";
import { emailService } from "../email/email.service";

// Simple in-memory cache
const pdfCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

class PdfService {
  private getCacheKey(invoiceId: string): string {
    return `invoice_${invoiceId}`;
  }

  private getFromCache(invoiceId: string): Buffer | null {
    const key = this.getCacheKey(invoiceId);
    const cached = pdfCache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      logger.info(`PDF cache hit for invoice ${invoiceId}`);
      return cached.buffer;
    }

    if (cached) {
      pdfCache.delete(key);
    }

    return null;
  }

  private setCache(invoiceId: string, buffer: Buffer): void {
    const key = this.getCacheKey(invoiceId);
    pdfCache.set(key, { buffer, timestamp: Date.now() });
    logger.info(`PDF cached for invoice ${invoiceId}`);
  }

  async generatePdf(data: InvoicePdfData, invoiceId: string): Promise<Buffer> {
    // Check cache first
    const cached = this.getFromCache(invoiceId);
    if (cached) {
      return cached;
    }

    // Generate new PDF
    const pdfBuffer = await generateInvoicePdf(data);

    // Cache it
    this.setCache(invoiceId, pdfBuffer);

    return pdfBuffer;
  }

  async sendPdfToClient(
    invoiceData: InvoicePdfData,
    invoiceId: string,
  ): Promise<SendPdfResult> {
    try {
      // Generate PDF
      const pdfBuffer = await this.generatePdf(invoiceData, invoiceId);

      // Send email with attachment
      const sent = await emailService.sendInvoicePdf({
        to: invoiceData.customerEmail,
        customerName: invoiceData.customerName,
        invoiceNumber: invoiceData.invoiceNumber,
        total: invoiceData.total.toLocaleString("en-IN"),
        remainingBalance: invoiceData.remainingBalance.toLocaleString("en-IN"),
        dueDate: invoiceData.dueDate,
        pdfBuffer: pdfBuffer,
      });

      if (sent) {
        // Clear cache after successful send
        pdfCache.delete(this.getCacheKey(invoiceId));
        return { success: true, message: "Invoice PDF sent successfully" };
      }

      return { success: false, message: "Failed to send email" };
    } catch (error) {
      logger.error("Error sending PDF:", error);
      return { success: false, message: "Error generating or sending PDF" };
    }
  }

  clearCache(invoiceId?: string): void {
    if (invoiceId) {
      pdfCache.delete(this.getCacheKey(invoiceId));
    } else {
      pdfCache.clear();
    }
  }
}

export const pdfService = new PdfService();
