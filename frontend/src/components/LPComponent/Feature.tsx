import { motion } from "framer-motion";
import {
  HiDocumentText,
  HiClipboardList,
  HiUserGroup,
  HiCurrencyDollar,
  HiChartBar,
  HiShieldCheck,
  HiSparkles,
  HiBell,
  HiMail,
} from "react-icons/hi";

const Feature = () => {
  const features = [
    {
      icon: HiDocumentText,
      title: "Invoice Management",
      description:
        "Create, edit, and track invoices with automatic overdue detection. Convert approved quotations to invoices in one click and send PDFs directly to clients.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "hover:border-blue-400",
      shadowColor: "hover:shadow-blue-500/10",
      accentColor: "bg-blue-500",
    },
    {
      icon: HiClipboardList,
      title: "Quotation Management",
      description:
        "Generate professional quotations with approval workflows. Track status from draft to approved, and seamlessly convert to invoices when accepted.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "hover:border-emerald-400",
      shadowColor: "hover:shadow-emerald-500/10",
      accentColor: "bg-emerald-500",
    },
    {
      icon: HiBell,
      title: "Smart Notifications",
      description:
        "Automated daily scheduler checks due dates and sends reminders. Get real-time alerts for overdue invoices via email and WhatsApp notifications.",
      color: "text-red-600",
      bg: "bg-red-50",
      borderColor: "hover:border-red-400",
      shadowColor: "hover:shadow-red-500/10",
      accentColor: "bg-red-500",
    },
    {
      icon: HiMail,
      title: "PDF & Email Delivery",
      description:
        "Generate polished PDF invoices and quotations with PDFKit. Send them instantly via email with attachments, or share directly through WhatsApp.",
      color: "text-purple-600",
      bg: "bg-purple-50",
      borderColor: "hover:border-purple-400",
      shadowColor: "hover:shadow-purple-500/10",
      accentColor: "bg-purple-500",
    },
    {
      icon: HiChartBar,
      title: "Revenue Dashboard",
      description:
        "Monitor total revenue, outstanding payments, invoice status distribution, and payment methods. Visual charts help track business performance at a glance.",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      borderColor: "hover:border-cyan-400",
      shadowColor: "hover:shadow-cyan-500/10",
      accentColor: "bg-cyan-500",
    },
    {
      icon: HiCurrencyDollar,
      title: "Payment Tracking",
      description:
        "Record and track payments linked to invoices with multiple statuses and methods. Filter by amount, date, or payment type for complete financial oversight.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "hover:border-amber-400",
      shadowColor: "hover:shadow-amber-500/10",
      accentColor: "bg-amber-500",
    },
    {
      icon: HiUserGroup,
      title: "Customer Portal",
      description:
        "Centralize customer data with GST, contacts, and transaction history. Search and filter customers to quickly access their quotes, invoices, and payments.",
      color: "text-violet-600",
      bg: "bg-violet-50",
      borderColor: "hover:border-violet-400",
      shadowColor: "hover:shadow-violet-500/10",
      accentColor: "bg-violet-500",
    },
    {
      icon: HiShieldCheck,
      title: "Role-Based Access",
      description:
        "Secure authentication with JWT tokens and HTTP-only cookies. Admin-only controls for critical operations while users access assigned features safely.",
      color: "text-green-600",
      bg: "bg-green-50",
      borderColor: "hover:border-green-400",
      shadowColor: "hover:shadow-green-500/10",
      accentColor: "bg-green-500",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="features">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02] bg-[radial-gradient(circle,var(--color-brand),transparent)] translate-x-[30%] -translate-y-[30%]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.02] bg-[radial-gradient(circle,#7c3aed,transparent)] -translate-x-[30%] translate-y-[30%]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16">
          {/* Left Side - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-3/5 grid sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 + index * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`group p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer bg-white border border-border shadow-sm ${feature.borderColor} hover:shadow-lg`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${feature.bg}`}>
                  <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold mb-1.5 tracking-tight text-text-primary">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs leading-relaxed text-text-secondary">
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-3 rounded-full ${feature.accentColor}`} />
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="w-full lg:w-2/5 lg:sticky lg:top-24"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-brand-light text-brand"
            >
              <HiSparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4"
            >
              <span className="text-text-primary">Everything You Need to</span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Your Business
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg leading-relaxed text-text-secondary"
            >
              A complete suite of tools to handle invoices, customers, payments,
              and more—all in one place.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Feature;