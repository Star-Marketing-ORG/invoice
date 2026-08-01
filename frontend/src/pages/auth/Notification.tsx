import { useState } from "react";
import { motion } from "framer-motion";
import {
  TbBell,
  TbFileInvoice,
  TbFileDescription,
  TbCheck,
  TbTrash,
  TbArrowUpRight,
  TbCalendar,
  TbAlertTriangle,
  TbClock,
} from "react-icons/tb";
import {
  useNotifications,
  useMarkAllAsRead,
  useDeleteAllNotifications,
  useMarkAsRead,
} from "../../features/hooks/useNotification";
import { Skeleton } from "../../components/ui/SkeletonCard";

export default function Notification() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "INVOICE" | "QUOTATION"
  >("all");

  const { data, isLoading } = useNotifications(
    activeFilter !== "all" ? { entity: activeFilter } : undefined,
  );
  const markAllAsRead = useMarkAllAsRead();
  const deleteAll = useDeleteAllNotifications();
  const markAsRead = useMarkAsRead();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;
  const totalCount = data?.data?.total || 0;

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.entity === "INVOICE" && notification.invoiceId) {
      window.location.href = `/invoice/${notification.invoiceId}`;
    } else if (
      notification.entity === "QUOTATION" &&
      notification.quotationId
    ) {
      window.location.href = `/quotation/${notification.quotationId}`;
    }
  };

  const getNotificationStyle = (type: string) => {
    if (
      type.includes("DUE_TODAY") ||
      type.includes("DUE_NOW") ||
      type.includes("EXPIRED")
    ) {
      return {
        bg: "bg-red-50 border-red-200",
        border: "border-l-4 border-l-danger",
        iconBg: "bg-danger/10 text-danger",
        badge: "bg-danger text-white",
        badgeText: "Action Needed",
        dot: "bg-danger animate-pulse",
        hover: "hover:shadow-lg hover:shadow-danger/10 hover:border-danger/30",
        icon: TbAlertTriangle,
      };
    }
    if (type.includes("DUE_TOMORROW")) {
      return {
        bg: "bg-orange-50 border-orange-200",
        border: "border-l-4 border-l-orange-400",
        iconBg: "bg-orange-100 text-orange-600",
        badge: "bg-orange-100 text-orange-700",
        badgeText: "Upcoming",
        dot: "bg-orange-500",
        hover:
          "hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-300",
        icon: TbClock,
      };
    }
    if (type.includes("DUE_IN_TWO_DAYS")) {
      return {
        bg: "bg-blue-50 border-blue-200",
        border: "border-l-4 border-l-blue-400",
        iconBg: "bg-blue-100 text-blue-600",
        badge: "bg-blue-100 text-blue-700",
        badgeText: "Soon",
        dot: "bg-blue-500",
        hover: "hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300",
        icon: TbClock,
      };
    }
    return {
      bg: "bg-white border-border",
      border: "",
      iconBg: "bg-surface-hover text-text-muted",
      badge: "bg-surface-hover text-text-muted",
      badgeText: "Read",
      dot: "bg-transparent",
      hover: "hover:shadow-md hover:border-brand/20",
      icon: TbBell,
    };
  };

  const getEntityIcon = (entity: string) => {
    return entity === "INVOICE" ? TbFileInvoice : TbFileDescription;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Skeleton Loading
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-20 h-6 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Notifications
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Stay updated with your invoices and quotations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => markAllAsRead.mutate()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand bg-brand/5 hover:bg-brand/10 rounded-xl transition-all"
              >
                <TbCheck size={18} />
                Mark all read
              </motion.button>
            )}
            {totalCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => deleteAll.mutate()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
              >
                <TbTrash size={18} />
                Clear all
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-8"
      >
        {[
          { key: "all", label: "All Notifications", count: totalCount },
          { key: "INVOICE", label: "Invoices", count: null },
          { key: "QUOTATION", label: "Quotations", count: null },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeFilter === tab.key
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                : "bg-white text-text-secondary hover:bg-surface-hover border border-border"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {tab.count}
              </span>
            )}
            {activeFilter === tab.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gray-900 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Summary */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
              Action Needed
            </p>
            <p className="text-2xl font-bold text-red-700">
              {
                notifications.filter(
                  (n) =>
                    n.type.includes("DUE_TODAY") ||
                    n.type.includes("DUE_NOW") ||
                    n.type.includes("EXPIRED"),
                ).length
              }
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
              Upcoming
            </p>
            <p className="text-2xl font-bold text-orange-700">
              {
                notifications.filter((n) => n.type.includes("DUE_TOMORROW"))
                  .length
              }
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Soon
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {
                notifications.filter((n) => n.type.includes("DUE_IN_TWO_DAYS"))
                  .length
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Notification List */}
      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-24 h-24 bg-surface-hover rounded-3xl flex items-center justify-center mb-6">
            <TbBell size={40} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No notifications
          </h3>
          <p className="text-sm text-text-muted text-center max-w-sm">
            You're all caught up! New notifications about invoices and
            quotations will appear here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          {notifications.map((notification, index) => {
            const style = getNotificationStyle(notification.type);
            const EntityIcon = getEntityIcon(notification.entity);
            const IconComponent = style.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 ${style.bg} ${style.border} ${style.hover} overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}
                    >
                      <EntityIcon size={20} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span
                              className={`w-2 h-2 rounded-full ${style.dot} shrink-0`}
                            />
                          )}
                          <p className="text-sm font-semibold text-text-primary leading-snug">
                            {notification.message}
                          </p>
                        </div>
                        <TbArrowUpRight
                          size={16}
                          className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
                        <TbCalendar size={12} />
                        <span>{getTimeAgo(notification.createdAt)}</span>
                        <span>•</span>
                        <span className="font-semibold capitalize">
                          {notification.entity.toLowerCase()}
                        </span>
                      </div>

                      {/* Customer info */}
                      {(notification.invoice?.customer?.name ||
                        notification.quotation?.customer?.name) && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-text-muted font-medium truncate">
                            {notification.invoice?.customer?.name ||
                              notification.quotation?.customer?.name}
                          </p>
                          {notification.invoice?.invoiceNumber && (
                            <span className="text-xs font-mono text-brand/70 bg-brand/5 px-1.5 py-0.5 rounded">
                              {notification.invoice.invoiceNumber}
                            </span>
                          )}
                          {notification.quotation?.quotationNumber && (
                            <span className="text-xs font-mono text-brand/70 bg-brand/5 px-1.5 py-0.5 rounded">
                              {notification.quotation.quotationNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    <div className="shrink-0">
                      {notification.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-hover text-text-muted rounded-lg text-[10px] font-semibold">
                          <TbCheck size={12} />
                          Read
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${style.badge}`}
                        >
                          <IconComponent size={12} />
                          {style.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
