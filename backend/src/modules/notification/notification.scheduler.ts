import cron from "node-cron";
import { prisma } from "../../database/client";
import { notificationService } from "./notification.service";
import { invoiceRepository } from "../invoice/invoice.repository";
import { logger } from "../../config/logger";
import { emailService } from "../email/email.service";
import { whatsappService } from "../email/whatsapp.service";

export class NotificationScheduler {
  private cronExpression = "* * * * *";

  public startScheduler() {
    logger.info("Notification scheduler initialized");

    emailService.verifyConnection().then((connected) => {
      if (connected) {
        logger.info("Email service ready");
      } else {
        logger.warn("Email service not available");
      }
    });

    cron.schedule(this.cronExpression, async () => {
      logger.info("Running notification check...");
      await this.checkInvoiceDueDates();
      await this.checkQuotationExpiryDates();
      logger.info("Notification check completed");
    });
  }

  private async checkInvoiceDueDates() {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const cutoffDate = new Date(2026, 7, 1); // August 1, 2026

      const invoices = await prisma.invoice.findMany({
        where: {
          status: {
            notIn: ["PAID", "CANCELLED", "OVERDUE"],
          },
          dueDate: {
            not: null,
          },
        },
        select: {
          id: true,
          invoiceNumber: true,
          dueDate: true,
          status: true,
          total: true,
          emailDueReminderSent: true,
          createdAt: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          payments: {
            select: {
              amount: true,
              status: true,
            },
          },
        },
      });

      for (const invoice of invoices) {
        if (!invoice.dueDate) continue;

        const dueDate = new Date(invoice.dueDate);
        const dueDateLocal = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate(),
        );

        if (dueDateLocal < cutoffDate) {
          continue;
        }

        const diffTime = dueDateLocal.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const totalAmount = Number(invoice.total);
        const totalPaid = invoice.payments
          .filter((p) => p.status === "COMPLETED")
          .reduce((sum, p) => sum + Number(p.amount), 0);
        const remainingBalance = totalAmount - totalPaid;

        if (diffDays === 2) {
          // Create notification
          await notificationService.createInvoiceDueNotification(
            invoice.id,
            invoice.invoiceNumber,
            "DUE_IN_TWO_DAYS",
          );

          // Send Email & WhatsApp if not already sent
          if (!invoice.emailDueReminderSent) {
            const reminderData = {
              customerName: invoice.customer?.name || "Customer",
              invoiceNumber: invoice.invoiceNumber,
              total: totalAmount.toLocaleString("en-IN"),
              remainingBalance: remainingBalance.toLocaleString("en-IN"),
              dueDate: dueDateLocal.toLocaleDateString("en-IN"),
              invoiceCreatedAt: invoice.createdAt,
            };

            // Send Email
            if (invoice.customer?.email) {
              const emailSent = await emailService.sendDueReminder({
                to: invoice.customer.email,
                ...reminderData,
              });

              if (emailSent) {
                logger.info(
                  `Due reminder email sent for ${invoice.invoiceNumber}`,
                );
              }
            }

            // Send WhatsApp
            if (invoice.customer?.phone) {
              const waSent = await whatsappService.sendInvoiceReminder({
                phone: invoice.customer.phone,
                ...reminderData,
              });

              if (waSent) {
                logger.info(
                  `Due reminder WhatsApp sent for ${invoice.invoiceNumber}`,
                );
              }
            }

            // Mark as sent (either email or WhatsApp was attempted)
            if (invoice.customer?.email || invoice.customer?.phone) {
              await invoiceRepository.markEmailDueReminderSent(invoice.id);
            }
          }
        } else if (diffDays === 1) {
          await notificationService.createInvoiceDueNotification(
            invoice.id,
            invoice.invoiceNumber,
            "DUE_TOMORROW",
          );
        } else if (diffDays === 0) {
          await notificationService.createInvoiceDueNotification(
            invoice.id,
            invoice.invoiceNumber,
            "DUE_TODAY",
          );
        } else if (diffDays < 0) {
          await notificationService.createInvoiceDueNotification(
            invoice.id,
            invoice.invoiceNumber,
            "DUE_NOW",
          );
        }
      }

      await this.sendOverdueAlerts(cutoffDate);
    } catch (error) {
      logger.error("Error checking invoice due dates:", error);
    }
  }

  private async sendOverdueAlerts(cutoffDate: Date) {
    try {
      const overdueInvoices =
        await invoiceRepository.findInvoicesForOverdueEmail();

      for (const invoice of overdueInvoices) {
        if (!invoice.dueDate) continue;

        const dueDate = new Date(invoice.dueDate);
        const dueDateLocal = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate(),
        );

        if (dueDateLocal < cutoffDate) {
          continue;
        }

        const totalAmount = Number(invoice.total);
        const totalPaid =
          (invoice as any).payments
            ?.filter((p: any) => p.status === "COMPLETED")
            .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
        const remainingBalance = totalAmount - totalPaid;

        const alertData = {
          customerName: invoice.customer?.name || "Customer",
          invoiceNumber: invoice.invoiceNumber,
          total: totalAmount.toLocaleString("en-IN"),
          remainingBalance: remainingBalance.toLocaleString("en-IN"),
          dueDate: dueDateLocal.toLocaleDateString("en-IN"),
          invoiceCreatedAt: invoice.createdAt,
        };

        // Send Email
        if (invoice.customer?.email) {
          const emailSent = await emailService.sendOverdueAlert({
            to: invoice.customer.email,
            ...alertData,
          });

          if (emailSent) {
            logger.info(`Overdue email sent for ${invoice.invoiceNumber}`);
          }
        }

        // Send WhatsApp
        if (invoice.customer?.phone) {
          const waSent = await whatsappService.sendOverdueAlert({
            phone: invoice.customer.phone,
            ...alertData,
          });

          if (waSent) {
            logger.info(`Overdue WhatsApp sent for ${invoice.invoiceNumber}`);
          }
        }

        // Mark as sent
        if (invoice.customer?.email || invoice.customer?.phone) {
          await invoiceRepository.markEmailOverdueSent(invoice.id);
        }
      }
    } catch (error) {
      logger.error("Error sending overdue alerts:", error);
    }
  }

  private async checkQuotationExpiryDates() {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const cutoffDate = new Date(2026, 7, 1); // August 1, 2026

      const quotations = await prisma.quotation.findMany({
        where: {
          status: {
            in: ["SENT", "APPROVED"],
          },
          expiryDate: {
            not: null,
          },
        },
        select: {
          id: true,
          quotationNumber: true,
          expiryDate: true,
          status: true,
        },
      });

      for (const quotation of quotations) {
        if (!quotation.expiryDate) continue;

        const expiryDate = new Date(quotation.expiryDate);
        const expiryDateLocal = new Date(
          expiryDate.getFullYear(),
          expiryDate.getMonth(),
          expiryDate.getDate(),
        );

        if (expiryDateLocal < cutoffDate) {
          continue;
        }

        const diffTime = expiryDateLocal.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 2) {
          await notificationService.createQuotationExpiryNotification(
            quotation.id,
            quotation.quotationNumber,
            "DUE_IN_TWO_DAYS",
          );
        } else if (diffDays === 1) {
          await notificationService.createQuotationExpiryNotification(
            quotation.id,
            quotation.quotationNumber,
            "DUE_TOMORROW",
          );
        } else if (diffDays === 0) {
          await notificationService.createQuotationExpiryNotification(
            quotation.id,
            quotation.quotationNumber,
            "DUE_TODAY",
          );
        } else if (diffDays < 0 && quotation.status !== "EXPIRED") {
          await notificationService.createQuotationExpiryNotification(
            quotation.id,
            quotation.quotationNumber,
            "EXPIRED",
          );
        }
      }
    } catch (error) {
      logger.error("Error checking quotation expiry dates:", error);
    }
  }
}

export const notificationScheduler = new NotificationScheduler();
