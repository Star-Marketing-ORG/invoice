import type { Notification } from "@invoice/shared/types";
import axiosInstance from "../../utils/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export const notificationApi = {
  getAll: (params?: { entity?: string; isRead?: string }) =>
    axiosInstance
      .get<ApiResponse<NotificationListResponse>>("/notifications", { params })
      .then((res) => res.data),

  getUnreadCount: () =>
    axiosInstance
      .get<ApiResponse<{ count: number }>>("/notifications/unread-count")
      .then((res) => res.data),

  markAsRead: (id: string) =>
    axiosInstance
      .patch<ApiResponse<Notification>>(`/notifications/${id}/read`)
      .then((res) => res.data),

  markAllAsRead: () =>
    axiosInstance
      .patch<ApiResponse<{ updatedCount: number }>>("/notifications/read-all")
      .then((res) => res.data),

  deleteAll: () =>
    axiosInstance
      .delete<ApiResponse<{ deletedCount: number }>>("/notifications")
      .then((res) => res.data),
};
