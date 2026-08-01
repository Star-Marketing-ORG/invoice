import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import { toast } from "../../utils/toast";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params?: any) => [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useNotifications(params?: { entity?: string; isRead?: string }) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getAll(params),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success(data.message || "All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark all as read");
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.deleteAll(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success(data.message || "All notifications deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete notifications");
    },
  });
}