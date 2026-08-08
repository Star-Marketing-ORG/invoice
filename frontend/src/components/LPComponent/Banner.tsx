import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  HiDocumentText,
  HiUserGroup,
  HiClipboardList,
  HiCube,
  HiCurrencyDollar,
  HiArrowRight,
  HiBadgeCheck,
  HiPlay,
  HiBell,
  HiDeviceMobile,
  HiDocumentDownload,
  HiX,
  HiSparkles,
} from "react-icons/hi";

const Banner = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const highlights = [
    { icon: HiDocumentText, label: "Invoice Management" },
    { icon: HiClipboardList, label: "Quotation Management" },
    { icon: HiCurrencyDollar, label: "Payment Tracking" },
    { icon: HiBell, label: "Real-time Notifications" },
    { icon: HiDeviceMobile, label: "Auto Alerts (Email & WhatsApp)" },
    { icon: HiDocumentDownload, label: "Instant PDF Generation" },
  ];

  const cards = [
    {
      id: 0,
      icon: HiDocumentText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Invoice",
      subtitle: "INV-2024-089",
      value: "$2,450",
      badge: "Paid",
      badgeBg: "bg-emerald-50",
      badgeColor: "text-emerald-600",
      position: "top-0 left-0",
      animationClass: "animate-float-slow",
      rotation: "-rotate-1",
      hasProgress: true,
      progressWidth: "w-3/4",
      progressColor: "bg-emerald-500",
    },
    {
      id: 1,
      icon: HiUserGroup,
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      iconColor: "text-white",
      title: "Sarah Johnson",
      subtitle: "Acme Corp",
      value: "12 invoices",
      badge: "Active",
      badgeBg: "",
      badgeColor: "text-emerald-600",
      isAvatar: true,
      avatar: "SJ",
      position: "top-4 right-0",
      animationClass: "animate-float-medium",
      rotation: "rotate-1",
    },
    {
      id: 2,
      icon: HiClipboardList,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Quotation",
      subtitle: "QUO-2024-045",
      value: "$5,600",
      badge: "Sent",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-600",
      position: "top-[140px] left-2",
      animationClass: "animate-float-slower",
      rotation: "-rotate-2",
      hasProgress: true,
      progressWidth: "w-1/2",
      progressColor: "bg-amber-500",
    },
    {
      id: 3,
      icon: HiCube,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      title: "Web Development",
      subtitle: "PRD-001",
      value: "$1,200",
      badge: "45 sold",
      badgeBg: "",
      badgeColor: "text-text-muted",
      position: "top-[140px] right-1",
      animationClass: "animate-float-slow",
      rotation: "rotate-2",
    },
    {
      id: 4,
      icon: HiCurrencyDollar,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      title: "Payment Received",
      subtitle: "via Stripe · Today",
      value: "+$1,890",
      badge: "Success",
      badgeBg: "bg-emerald-50",
      badgeColor: "text-emerald-600",
      isSuccess: true,
      position: "bottom-0 left-1/2 -translate-x-1/2",
      animationClass: "animate-float-medium",
      rotation: "rotate-0",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-20">
      {/* Tailwind Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3.5s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl bg-[radial-gradient(circle,var(--color-brand),transparent_70%)] translate-x-[30%] -translate-y-[30%]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl bg-[radial-gradient(circle,#7c3aed,transparent_70%)] -translate-x-[20%] translate-y-[20%]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-brand-light text-brand border border-brand/10"
            >
              <HiBadgeCheck className="w-4 h-4" />
              <span>Smart Invoicing Solution</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              <span className="text-text-primary">Simplify your</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  billing workflow
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-20 bg-gradient-to-r from-brand to-purple-600" />
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 text-text-secondary">
              Create invoices, send PDFs, and automate reminders via email &
              WhatsApp. Track payments, monitor revenue with real-time
              dashboards, and manage your entire billing workflow from one
              intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <motion.a
                href="#features"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white overflow-hidden bg-brand shadow-lg shadow-brand/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Features
                  <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.a>

              <motion.a
                href="#demo"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 text-text-primary border-1.5 border-border bg-surface hover:bg-surface-hover"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <HiPlay className="w-3 h-3" />
                </span>
                View Demo
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-default bg-surface text-text-secondary border border-border-light hover:border-brand/30 hover:text-text-primary"
                >
                  <item.icon className="w-3.5 h-3.5  text-brand" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3,
            }}
          >
            {/* Mobile Grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`${index === 4 ? "col-span-2" : ""} p-4 rounded-2xl bg-white border border-border shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                    >
                      {card.isAvatar ? (
                        <span className="text-[11px] font-bold text-white">
                          {card.avatar}
                        </span>
                      ) : (
                        <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-tight truncate text-text-primary">
                        {card.title}
                      </p>
                      <p className="text-[10px] font-medium truncate text-text-muted">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold tracking-tight ${card.isSuccess ? "text-emerald-600" : "text-text-primary"}`}
                    >
                      {card.value}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide ${card.badgeBg} ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Floating Cards */}
            <div className="hidden lg:flex items-center justify-center min-h-[520px]">
              <div className="relative w-[480px] h-[420px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-3xl bg-[radial-gradient(circle,var(--color-brand),transparent)]" />

                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + card.id * 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={`absolute ${card.position} w-[220px] ${card.animationClass}`}
                    style={{ zIndex: hoveredCard === card.id ? 10 : 1 }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -12,
                        rotate: 0,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                      className={card.rotation}
                    >
                      <div
                        className={`p-5 rounded-2xl bg-white cursor-pointer transition-shadow duration-300 border ${
                          hoveredCard === card.id
                            ? "border-brand/20 shadow-2xl shadow-black/10"
                            : "border-border shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
                          >
                            {card.isAvatar ? (
                              <span className="text-xs font-bold text-white">
                                {card.avatar}
                              </span>
                            ) : (
                              <card.icon
                                className={`w-4.5 h-4.5 ${card.iconColor}`}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-tight truncate text-text-primary">
                              {card.title}
                            </p>
                            <p className="text-[11px] font-medium truncate text-text-muted">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold tracking-tight ${card.isSuccess ? "text-emerald-600" : "text-text-primary"}`}
                          >
                            {card.value}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold tracking-wide ${card.badgeBg} ${card.badgeColor}`}
                          >
                            {card.badge}
                          </span>
                        </div>
                        {card.hasProgress && (
                          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${card.progressWidth} ${card.progressColor}`}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
