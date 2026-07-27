import React from "react";
import { motion } from "framer-motion";
import {
  HiDocumentText,
  HiClipboardList,
  HiUserGroup,
  HiCube,
  HiCurrencyDollar,
  HiChartBar,
  HiSearch,
  HiShieldCheck,
  HiLockClosed,
  HiSparkles,
} from "react-icons/hi";

const Feature = () => {
  const features = [
    {
      icon: HiDocumentText,
      title: "Invoice Management",
      description:
        "Create, edit, organise, and track invoices with an efficient workflow designed for everyday business operations.",
      color: "#2563eb",
      bg: "#dbeafe",
    },
    {
      icon: HiClipboardList,
      title: "Quotation Management",
      description:
        "Generate professional quotations, manage their status, and easily convert approved quotations into invoices.",
      color: "#059669",
      bg: "#d1fae5",
    },
    {
      icon: HiUserGroup,
      title: "Customer Management",
      description:
        "Maintain customer information in one central location for faster access and better organisation.",
      color: "#7c3aed",
      bg: "#ede9fe",
    },
    {
      icon: HiCube,
      title: "Service Management",
      description:
        "Organise your services with categories and pricing to simplify quotation and invoice creation.",
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      icon: HiCurrencyDollar,
      title: "Payment Management",
      description:
        "Record payments, monitor payment status, and maintain accurate billing records with ease.",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    {
      icon: HiChartBar,
      title: "Business Dashboard",
      description:
        "Track revenue, invoice activity, payment summaries, and overall business performance from a single dashboard.",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      icon: HiSearch,
      title: "Search & Filter",
      description:
        "Quickly find invoices, quotations, customers, services, and payments using powerful search and filtering options.",
      color: "#4f46e5",
      bg: "#e0e7ff",
    },
    {
      icon: HiLockClosed,
      title: "User Management",
      description:
        "Manage users with role-based permissions to ensure secure access and controlled business operations.",
      color: "#9333ea",
      bg: "#f3e8ff",
    },
    {
      icon: HiShieldCheck,
      title: "Secure Data Handling",
      description:
        "Protect your business information with secure authentication, controlled access, and reliable data validation.",
      color: "#15803d",
      bg: "#dcfce7",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="features">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand), transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #7c3aed, transparent)",
            transform: "translate(-30%, 30%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-2 lg:px-8">
        <div className=" flex flex-col-reverse md:flex-row gap-12 lg:gap-16">
          {/* Left Side - Features Grid (3 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-3 grid sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + index * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -2 }}
                className="group p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0, 0, 0, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.02)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="text-xs sm:text-sm font-bold mb-1.5 tracking-tight"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[11px] sm:text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <div
                  className="h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-3 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Content (2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
              }}
            >
              <HiSparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4">
              <span style={{ color: "var(--color-text-primary)" }}>
                Everything You Need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Your Business
              </span>
            </h2>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              A complete suite of tools to handle invoices, customers, payments,
              and more—all in one place.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
