import React from "react";
import { motion } from "framer-motion";
import {
  HiClock,
  HiFolder,
  HiUserGroup,
  HiChartBar,
  HiShieldCheck,
  HiLockClosed,
  HiSearch,
  HiTrendingUp,
  HiSparkles,
} from "react-icons/hi";

const Benefit = () => {
  const benefits = [
    {
      icon: HiClock,
      title: "Save Valuable Time",
      description:
        "Automate routine billing tasks and complete your daily workflow faster with an organised management system.",
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      icon: HiFolder,
      title: "Keep Everything Organised",
      description:
        "Manage customers, services, quotations, invoices, and payments from one centralised platform.",
      color: "#059669",
      bg: "#f0fdf4",
    },
    {
      icon: HiUserGroup,
      title: "Improve Team Productivity",
      description:
        "Reduce repetitive work and help your team complete tasks more efficiently through a streamlined workflow.",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: HiChartBar,
      title: "Make Better Business Decisions",
      description:
        "Gain valuable insights into revenue, invoices, and payment activity through a clear and informative dashboard.",
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      icon: HiShieldCheck,
      title: "Reduce Errors",
      description:
        "Maintain accurate records with structured data management and built-in validation throughout your workflow.",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      icon: HiLockClosed,
      title: "Secure Your Business Data",
      description:
        "Protect sensitive information with secure user authentication and controlled access permissions.",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      icon: HiSearch,
      title: "Faster Access to Information",
      description:
        "Quickly locate customers, invoices, quotations, services, and payments using advanced search and filtering.",
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      icon: HiTrendingUp,
      title: "Built to Grow with Your Business",
      description:
        "A flexible invoice management solution that supports businesses as their operations expand and evolve.",
      color: "#9333ea",
      bg: "#faf5ff",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="benefits">
      <div className="relative max-w-7xl mx-auto px-2 lg:px-8">
        <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-16">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:sticky lg:top-24"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
              }}
            >
              <HiSparkles className="w-4 h-4" />
              <span>Key Benefits</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
              <span style={{ color: "var(--color-text-primary)" }}>
                Why Choose Our Invoice
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Management System?
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Designed to simplify your workflow, improve accuracy, and help
              your business grow.
            </p>
          </motion.div>

          {/* Right Side - Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="grid sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + index * 0.06,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.06)",
                  borderColor: benefit.color,
                  transition: { duration: 0.2 },
                }}
                className="p-4 sm:p-5 rounded-2xl cursor-pointer"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                }}
              >
                {/* Icon */}
                <motion.div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: benefit.bg }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <benefit.icon
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: benefit.color }}
                  />
                </motion.div>

                {/* Title */}
                <h3
                  className="text-xs sm:text-sm font-bold mb-1.5 tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[11px] sm:text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefit;
