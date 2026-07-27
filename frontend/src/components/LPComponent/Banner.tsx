import { motion } from "framer-motion";
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
  const highlights = [
    { icon: HiDocumentText, label: "Invoice Management" },
    { icon: HiClipboardList, label: "Quotation Management" },
    { icon: HiCurrencyDollar, label: "Payment Tracking" },
    { icon: HiCube, label: "Product Catalog" },
    { icon: HiUserGroup, label: "Customer Portal" },
  ];

  const cards = [
    {
      icon: HiDocumentText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Invoice",
      subtitle: "INV-2024-089",
      value: "$2,450",
      badge: "Paid",
      badgeBg: "bg-emerald-50",
      badgeColor: "text-emerald-600",
    },
    {
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
    },
    {
      icon: HiClipboardList,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Quotation",
      subtitle: "QUO-2024-045",
      value: "$5,600",
      badge: "Sent",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-600",
    },
    {
      icon: HiCube,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      title: "Web Development",
      subtitle: "PRD-001",
      value: "$1,200",
      badge: "45 sold",
      badgeBg: "",
      badgeColor: "text-text-muted",
    },
    {
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
    },
  ];

  return (
    <section className="relative overflow-hidden pt-10 md:pt-0 pb-20">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand), transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-2 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <HiBadgeCheck className="w-4 h-4" />
              <span>Smart Invoicing Solution</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span style={{ color: "var(--color-text-primary)" }}>
                Simplify Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Billing Workflow
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Create invoices, manage customers, track payments, and monitor
              your business with one powerful invoice management solution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.a
                href="#features"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white transition-colors duration-200"
                style={{
                  backgroundColor: "var(--color-brand)",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                }}
              >
                Explore Features
                <HiArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <HiPlay className="w-4 h-4" />
                View Demo
              </motion.a>
            </div>

            {/* Highlights */}
            <div className="mt-10 flex flex-wrap gap-2 justify-center lg:justify-start">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-light)",
                  }}
                >
                  <item.icon className="w-3.5 h-3.5 opacity-60" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Desktop Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
          >
            {/* Mobile Grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`${index === 4 ? "col-span-2" : ""} p-4 rounded-2xl bg-white`}
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
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
                </div>
              ))}
            </div>

            {/* Desktop Floating Cards */}
            <div className="hidden lg:flex items-center justify-center h-[500px]">
              <div className="relative w-[460px] h-[380px]">
                {/* Card 1 - Invoice (Top Left) */}
                <div
                  className="absolute top-0 left-0 w-[210px]"
                  style={{ animation: "float-slow 6s ease-in-out infinite" }}
                >
                  <div
                    className="p-4 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50">
                        <HiDocumentText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Invoice
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          INV-2024-089
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        $2,450
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide bg-emerald-50 text-emerald-600">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Customer (Top Right) */}
                <div
                  className="absolute top-2 right-0 w-[210px]"
                  style={{
                    animation: "float-medium 6.5s ease-in-out infinite 0.5s",
                  }}
                >
                  <div
                    className="p-4 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
                        <span className="text-[11px] font-bold text-white">
                          SJ
                        </span>
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Sarah Johnson
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Acme Corp
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        12 invoices
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Quotation (Middle Left) */}
                <div
                  className="absolute top-[130px] left-3 w-[210px]"
                  style={{
                    animation: "float-slower 5.5s ease-in-out infinite 1s",
                  }}
                >
                  <div
                    className="p-4 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50">
                        <HiClipboardList className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Quotation
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          QUO-2024-045
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        $5,600
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide bg-amber-50 text-amber-600">
                        Sent
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4 - Product (Middle Right) */}
                <div
                  className="absolute top-[130px] right-2 w-[210px]"
                  style={{
                    animation: "float-medium-slow 7s ease-in-out infinite 1.5s",
                  }}
                >
                  <div
                    className="p-4 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50">
                        <HiCube className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Web Development
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          PRD-001
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        $1,200
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        45 sold
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 5 - Payment (Bottom Center) */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[230px]"
                  style={{ animation: "float-slow 6s ease-in-out infinite 2s" }}
                >
                  <div
                    className="p-4 rounded-2xl bg-white cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50">
                        <HiCurrencyDollar className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-xs font-semibold tracking-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Payment Received
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          via Stripe · Today
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold tracking-tight text-emerald-600">
                        +$1,890
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold tracking-wide bg-emerald-50 text-emerald-600">
                        Success
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
