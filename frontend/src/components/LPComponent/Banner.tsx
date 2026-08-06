import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiDocumentText,
  HiUserGroup,
  HiClipboardList,
  HiCube,
  HiCurrencyDollar,
  HiArrowRight,
  HiBadgeCheck,
  HiPlay,
} from "react-icons/hi";

const Banner = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const highlights = [
    { icon: HiDocumentText, label: "Invoice Management" },
    { icon: HiClipboardList, label: "Quotation Management" },
    { icon: HiCurrencyDollar, label: "Payment Tracking" },
    { icon: HiCube, label: "Product Catalog" },
    { icon: HiUserGroup, label: "Customer Portal" },
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
      animationDelay: 0,
      rotation: "-rotate-1",
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
      animationDelay: 0.2,
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
      animationDelay: 0.4,
      rotation: "-rotate-2",
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
      animationDelay: 0.6,
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
      animationDelay: 0.8,
      rotation: "rotate-0",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 md:pt-16 lg:pt-20 pb-24 lg:pb-32">
      {/* Refined Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient orb */}
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand), transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        {/* Secondary accent orb */}
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #7c3aed, transparent 70%)",
            transform: "translate(-20%, 20%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content - Enhanced Typography & Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center lg:text-left"
          >
            {/* Refined Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
                border: "1px solid rgba(37, 99, 235, 0.12)",
              }}
            >
              <HiBadgeCheck className="w-4 h-4" />
              <span>Smart Invoicing Solution</span>
            </motion.div>

            {/* Enhanced Heading with Better Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              <span style={{ color: "var(--color-text-primary)" }}>
                Simplify your
              </span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  billing workflow
                </span>
                {/* Subtle underline accent */}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-20"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-brand), #7c3aed)",
                  }}
                />
              </span>
            </h1>

            {/* Refined Description with Better Readability */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Create professional invoices, manage customers, track payments, and 
              gain valuable insights — all from one intuitive platform designed for 
              modern businesses.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <motion.a
                href="#features"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white overflow-hidden"
                style={{
                  backgroundColor: "var(--color-brand)",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Features
                  <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.a>

              <motion.a
                href="#demo"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300"
                style={{
                  color: "var(--color-text-primary)",
                  border: "1.5px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <HiPlay className="w-3 h-3 ml-0.5" />
                </span>
                View Demo
              </motion.a>
            </div>

            {/* Enhanced Highlights with Better Visual Weight */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-default"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-light)",
                  }}
                >
                  <item.icon className="w-3.5 h-3.5 opacity-50" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Enhanced Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3,
            }}
          >
            {/* Mobile Grid - Refined */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`${index === 4 ? "col-span-2" : ""} p-4 rounded-2xl bg-white transition-shadow duration-300`}
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  }}
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
                      <p
                        className="text-xs font-semibold tracking-tight truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {card.title}
                      </p>
                      <p
                        className="text-[10px] font-medium truncate"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold tracking-tight`}
                      style={{
                        color: card.isSuccess
                          ? "#059669"
                          : "var(--color-text-primary)",
                      }}
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

            {/* Desktop Floating Cards - Completely Redesigned */}
            <div className="hidden lg:flex items-center justify-center min-h-[520px]">
              <div className="relative w-[480px] h-[420px]">
                {/* Background glow behind cards */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-brand), transparent)",
                  }}
                />

                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + card.animationDelay,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={`absolute ${card.position} w-[220px]`}
                    style={{ zIndex: hoveredCard === card.id ? 10 : 1 }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        rotate: hoveredCard === card.id ? 0 : undefined,
                      }}
                      transition={{
                        y: {
                          duration: 4 + card.animationDelay,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: card.animationDelay,
                        },
                        rotate: {
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -12,
                        rotate: 0,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                      className={`${card.rotation}`}
                    >
                      <div
                        className="p-5 rounded-2xl bg-white cursor-pointer transition-shadow duration-300"
                        style={{
                          border: "1px solid var(--color-border)",
                          boxShadow:
                            hoveredCard === card.id
                              ? "0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                              : "0 2px 8px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.04)",
                        }}
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
                            <p
                              className="text-xs font-semibold tracking-tight truncate"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {card.title}
                            </p>
                            <p
                              className="text-[11px] font-medium truncate"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {card.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold tracking-tight`}
                            style={{
                              color: card.isSuccess
                                ? "#059669"
                                : "var(--color-text-primary)",
                            }}
                          >
                            {card.value}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold tracking-wide ${card.badgeBg} ${card.badgeColor}`}
                          >
                            {card.badge}
                          </span>
                        </div>

                        {/* Subtle progress indicator for certain cards */}
                        {card.id === 0 && (
                          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full w-3/4 rounded-full bg-emerald-500"
                              style={{ transition: "width 1s ease" }}
                            />
                          </div>
                        )}
                        {card.id === 2 && (
                          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full w-1/2 rounded-full bg-amber-500"
                              style={{ transition: "width 1s ease" }}
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

      {/* Add floating animation keyframes */}
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
      `}</style>
    </section>
  );
};

export default Banner;