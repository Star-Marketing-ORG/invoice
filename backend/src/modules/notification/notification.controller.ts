import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { apiResponse } from "../../common/utils/apiResponse";
import { notificationService } from "./notification.service";

class NotificationController {
  getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await notificationService.getAllNotifications(
      req.query,
    );

    return apiResponse({
      res,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  });

  getUnreadCount = asyncHandler(async (_req: Request, res: Response) => {
    const data = await notificationService.getUnreadCount();

    return apiResponse({
      res,
      message: "Unread count fetched successfully",
      data,
    });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const notificationId = req.params.id as string;
    const notification = await notificationService.markAsRead(notificationId);

    return apiResponse({
      res,
      message: "Notification marked as read",
      data: notification,
    });
  });

  markAllAsRead = asyncHandler(async (_req: Request, res: Response) => {
    const data = await notificationService.markAllAsRead();

    return apiResponse({
      res,
      message: "All notifications marked as read",
      data,
    });
  });

  deleteAllNotifications = asyncHandler(
    async (_req: Request, res: Response) => {
      const data = await notificationService.deleteAllNotifications();

      return apiResponse({
        res,
        message: "All notifications deleted successfully",
        data,
      });
    },
  );
}

export const notificationController = new NotificationController();
