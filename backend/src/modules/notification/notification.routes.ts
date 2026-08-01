import { Router } from "express";
import { notificationController } from "./notification.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", notificationController.getAllNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/", notificationController.deleteAllNotifications);

export { router as notificationRouter };
