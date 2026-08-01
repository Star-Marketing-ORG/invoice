import { env } from "../../config/env";
import { logger } from "../../config/logger";

class WhatsAppService {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string = "v18.0";
  private baseUrl: string;

  constructor() {
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendMessage(phone: string, templateName: string, parameters: string[]): Promise<boolean> {
    try {
      let cleanPhone = phone.replace(/[\+\s\-]/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = "91" + cleanPhone;
      }

      const bodyParams = parameters.map((param) => ({
        type: "text",
        text: param,
      }));

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
            components: [
              {
                type: "body",
                parameters: bodyParams,
              },
            ],
          },
        }),
      });

      const data = await response.json();
      console.log("WhatsApp API Response:", JSON.stringify(data, null, 2));

      if (response.ok) {
        logger.info(`WhatsApp message sent to ${phone}`);
        return true;
      } else {
        logger.error(`WhatsApp API error:`, data);
        return false;
      }
    } catch (error) {
      logger.error(`Failed to send WhatsApp to ${phone}:`, error);
      return false;
    }
  }

  async sendInvoiceReminder(data: {
    phone: string;
    customerName: string;
    invoiceNumber: string;
    total: string;
    remainingBalance: string;
    dueDate: string;
  }): Promise<boolean> {
    return this.sendMessage(data.phone, "invoice_reminder", [
      data.customerName,
      data.invoiceNumber,
      `₹${data.total}`,
      `₹${data.remainingBalance}`,
      data.dueDate,
    ]);
  }

  async sendOverdueAlert(data: {
    phone: string;
    customerName: string;
    invoiceNumber: string;
    total: string;
    remainingBalance: string;
    dueDate: string;
  }): Promise<boolean> {
    return this.sendMessage(data.phone, "invoice_overdue", [
      data.customerName,
      data.invoiceNumber,
      `₹${data.total}`,
      `₹${data.remainingBalance}`,
      data.dueDate,
    ]);
  }
}

export const whatsappService = new WhatsAppService();