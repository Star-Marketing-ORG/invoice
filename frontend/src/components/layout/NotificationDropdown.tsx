import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  TbBell,
  TbCheck,
  TbClock,
  TbFileInvoice,
  TbFileDescription,
  TbArrowUpRight,
  TbAlertTriangle,
} from "react-icons/tb";
import {
  useNotifications,
  useUnreadCount,
  useMarkAllAsRead,
} from "../../features/hooks/useNotification";
import { Skeleton } from "../ui/SkeletonCard";

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAllAsRead = useMarkAllAsRead();

  const notifications =
    notificationsData?.data?.notifications?.slice(0, 4) || [];
  const unreadCount = unreadData?.data?.count || 0;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notification]")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNotifications(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (notification.entity === "INVOICE" && notification.invoiceId) {
      navigate(`/invoice/${notification.invoiceId}`);
    } else if (
      notification.entity === "QUOTATION" &&
      notification.quotationId
    ) {
      navigate(`/quotation/${notification.quotationId}`);
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationStyle = (type: string) => {
    if (
      type.includes("DUE_TODAY") ||
      type.includes("DUE_NOW") ||
      type.includes("EXPIRED")
    ) {
      return {
        bg: "bg-red-50/80 border-red-200/50",
        hoverBg: "hover:bg-red-100/50",
        iconBg: "bg-red-100 text-red-600",
        icon: TbAlertTriangle,
        dot: "bg-red-500 animate-pulse",
        unreadBg: "bg-gradient-to-r from-red-50/50 to-transparent",
        entityColor: "text-red-600",
        border: "border-l-[3px] border-l-red-400",
      };
    }
    if (type.includes("DUE_TOMORROW")) {
      return {
        bg: "bg-orange-50/80 border-orange-200/50",
        hoverBg: "hover:bg-orange-100/50",
        iconBg: "bg-orange-100 text-orange-600",
        icon: TbClock,
        dot: "bg-orange-500",
        unreadBg: "bg-gradient-to-r from-orange-50/50 to-transparent",
        entityColor: "text-orange-600",
        border: "border-l-[3px] border-l-orange-400",
      };
    }
    if (type.includes("DUE_IN_TWO_DAYS")) {
      return {
        bg: "bg-blue-50/80 border-blue-200/50",
        hoverBg: "hover:bg-blue-100/50",
        iconBg: "bg-blue-100 text-blue-600",
        icon: TbClock,
        dot: "bg-blue-500",
        unreadBg: "bg-gradient-to-r from-blue-50/50 to-transparent",
        entityColor: "text-blue-600",
        border: "border-l-[3px] border-l-blue-400",
      };
    }
    return {
      bg: "bg-white border-border",
      hoverBg: "hover:bg-surface-hover",
      iconBg: "bg-surface-hover text-text-muted",
      icon: TbBell,
      dot: "bg-transparent",
      unreadBg: "bg-gradient-to-r from-brand/[0.03] to-transparent",
      entityColor: "text-brand",
      border: "",
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

  return (
    <div data-notification className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2.5 hover:bg-surface-hover rounded-2xl transition-all duration-200 group"
      >
        <TbBell
          size={25}
          className="text-text-secondary group-hover:text-text-primary transition-colors"
        />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-danger rounded-full ring-2 ring-white text-[10px] font-bold text-white px-1"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-[440px] bg-white rounded-2xl border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-text-primary">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand/10 text-brand text-[11px] font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-all"
                >
                  <TbCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto">
              {isLoading ? (
                // Skeleton Loading
                <div className="py-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-16 px-5">
                  <div className="w-16 h-16 bg-surface-hover rounded-2xl flex items-center justify-center mb-4">
                    <TbBell size={28} className="text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-1">
                    All caught up!
                  </p>
                  <p className="text-xs text-text-muted text-center">
                    No new notifications at the moment
                  </p>
                </div>
              ) : (
                // Notification Items
                <div className="py-1">
                  {notifications.map((notification, index) => {
                    const style = getNotificationStyle(notification.type);
                    const EntityIcon = getEntityIcon(notification.entity);
                    const IconComponent = style.icon;

                    return (
                      <motion.button
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left px-5 py-3.5 transition-all duration-200 group/item relative border-b border-border/30 last:border-b-0 ${style.bg} ${style.hoverBg} ${
                          !notification.isRead
                            ? style.unreadBg + " " + style.border
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}
                          >
                            <EntityIcon size={18} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs text-text-primary leading-snug font-medium">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!notification.isRead && (
                                  <span
                                    className={`w-2 h-2 rounded-full ${style.dot} shrink-0 mt-1`}
                                  />
                                )}
                                <TbArrowUpRight
                                  size={14}
                                  className="text-text-muted opacity-0 group-hover/item:opacity-100 transition-opacity"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[11px] text-text-muted">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <span className="text-[11px] text-text-muted">
                                •
                              </span>
                              <span
                                className={`text-[11px] font-semibold capitalize ${style.entityColor}`}
                              >
                                {notification.entity.toLowerCase()}
                              </span>
                            </div>

                            {/* Customer name if available */}
                            {(notification.invoice?.customer?.name ||
                              notification.quotation?.customer?.name) && (
                              <p className="text-[11px] text-text-muted mt-1 truncate">
                                {notification.invoice?.customer?.name ||
                                  notification.quotation?.customer?.name}
                                {notification.invoice?.invoiceNumber && (
                                  <span className="ml-1.5 text-brand/60 font-mono">
                                    #{notification.invoice.invoiceNumber}
                                  </span>
                                )}
                                {notification.quotation?.quotationNumber && (
                                  <span className="ml-1.5 text-brand/60 font-mono">
                                    #{notification.quotation.quotationNumber}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border/50 bg-surface-hover/30">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setShowNotifications(false);
                  }}
                  className="w-full px-5 py-3 text-sm font-semibold text-brand hover:text-brand-dark hover:bg-surface-hover transition-all flex items-center justify-center gap-1.5"
                >
                  View all notifications
                  <TbArrowUpRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
