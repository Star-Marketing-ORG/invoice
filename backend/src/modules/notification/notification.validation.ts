import { z } from "zod";

export const getNotificationsSchema = z.object({
  query: z.object({
    entity: z.enum(["INVOICE", "QUOTATION"]).optional(),
    isRead: z.enum(["true", "false"]).optional(),
    cursor: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Notification ID is required"),
  }),
});