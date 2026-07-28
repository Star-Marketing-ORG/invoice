import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiShieldCheck,
  HiChartBar,
  HiLightningBolt,
} from "react-icons/hi";

const About = () => {
  const features = [
    {
      icon: HiCheckCircle,
      title: "Streamlined Workflow",
      description:
        "Manage invoices, quotations, and payments from one unified dashboard.",
      color: "#2563eb",
      bg: "#dbeafe",
    },
    {
      icon: HiShieldCheck,
      title: "Secure & Reliable",
      description:
        "Your data is protected with enterprise-grade security and encryption.",
      color: "#059669",
      bg: "#d1fae5",
    },
    {
      icon: HiChartBar,
      title: "Business Insights",
      description:
        "Track revenue, monitor payments, and analyze business performance.",
      color: "#7c3aed",
      bg: "#ede9fe",
    },
    {
      icon: HiLightningBolt,
      title: "Fast & Efficient",
      description:
        "Create professional invoices in seconds with automated calculations.",
      color: "#d97706",
      bg: "#fef3c7",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="about">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand), transparent)",
            transform: "translate(-30%, -20%)",
          }}
        />
        <div
          className="absolute bottom-20 right-0 w-[350px] h-[350px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #7c3aed, transparent)",
            transform: "translate(30%, 20%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-2 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "var(--color-brand-light)",
                color: "var(--color-brand)",
              }}
            >
              <HiLightningBolt className="w-4 h-4" />
              <span>Why Invoice Ready</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6">
              <span style={{ color: "var(--color-text-primary)" }}>
                Organise Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Business Finances
              </span>
            </h2>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Our Invoice Management System is designed to simplify and
              streamline everyday billing operations. Manage customers,
              services, quotations, invoices, and payments from one organised
              platform, giving you complete control over your business workflow.
            </p>

            <p
              className="text-base leading-relaxed mb-10 max-w-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              With an intuitive interface and powerful management tools, the
              platform helps reduce manual work, improve accuracy, and keep
              financial records organised. Track your business activity, monitor
              payments, and manage invoices with confidence—all while saving
              time and improving productivity.
            </p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="p-4 rounded-2xl"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <feature.icon
                      className="w-4 h-4"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--color-border)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Dashboard Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--color-border-light)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Dashboard — Invoice Ready
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  />
                  <div
                    className="w-6 h-6 rounded-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  />
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Total Invoices",
                      value: "156",
                      color: "#2563eb",
                      bg: "#dbeafe",
                    },
                    {
                      label: "Paid",
                      value: "$48.5K",
                      color: "#059669",
                      bg: "#d1fae5",
                    },
                    {
                      label: "Pending",
                      value: "23",
                      color: "#d97706",
                      bg: "#fef3c7",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl text-center"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <p
                        className="text-lg font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-[10px] font-medium"
                        style={{ color: stat.color, opacity: 0.8 }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Invoices Table Preview */}
                <div>
                  <p
                    className="text-xs font-semibold mb-3"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Recent Invoices
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        id: "INV-089",
                        customer: "Acme Corp",
                        amount: "$2,450",
                        status: "Paid",
                        statusColor: "#059669",
                        statusBg: "#d1fae5",
                      },
                      {
                        id: "INV-088",
                        customer: "Globex Inc",
                        amount: "$1,890",
                        status: "Pending",
                        statusColor: "#d97706",
                        statusBg: "#fef3c7",
                      },
                      {
                        id: "INV-087",
                        customer: "Stark Ltd",
                        amount: "$3,200",
                        status: "Draft",
                        statusColor: "#64748b",
                        statusBg: "#f1f5f9",
                      },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ backgroundColor: "var(--color-surface)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                            style={{
                              backgroundColor: "var(--color-brand-light)",
                              color: "var(--color-brand)",
                            }}
                          >
                            {invoice.customer[0]}
                          </div>
                          <div>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {invoice.customer}
                            </p>
                            <p
                              className="text-[10px]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {invoice.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {invoice.amount}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                            style={{
                              backgroundColor: invoice.statusBg,
                              color: invoice.statusColor,
                            }}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{
                          height: `${height}%`,
                          backgroundColor:
                            i >= 8
                              ? "var(--color-brand)"
                              : "var(--color-brand-light)",
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 z-10"
              style={{ animation: "float-slow 4s ease-in-out infinite" }}
            >
              <div
                className="px-5 py-3 rounded-2xl flex items-center gap-3"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <HiCheckCircle
                    className="w-5 h-5"
                    style={{ color: "#059669" }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    98%
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Customer Satisfaction
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Mini Card */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-4 -left-4 z-10"
              style={{ animation: "float-medium 3.5s ease-in-out infinite 1s" }}
            >
              <div
                className="px-4 py-2.5 rounded-xl flex items-center gap-2"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Invoice Sent
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
