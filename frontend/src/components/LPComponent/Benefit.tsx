import { motion } from "framer-motion";
import {
  HiClock,
  HiFolder,
  HiChartBar,
  HiShieldCheck,
  HiLockClosed,
  HiSparkles,
  HiMail,
  HiSwitchHorizontal,
  HiTerminal,
  HiDeviceMobile,
} from "react-icons/hi";

const Benefit = () => {
  const benefits = [
    {
      icon: HiClock,
      title: "Automate Follow-ups",
      description:
        "Stop chasing payments manually. The notification scheduler automatically sends due reminders and overdue alerts via email and WhatsApp.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderHover: "hover:border-blue-400",
      shadowHover: "hover:shadow-blue-500/10",
    },
    {
      icon: HiMail,
      title: "Send Professional PDFs Instantly",
      description:
        "Generate polished invoices and quotations as PDFs, then email them directly to clients with one click — no external tools needed.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderHover: "hover:border-emerald-400",
      shadowHover: "hover:shadow-emerald-500/10",
    },
    {
      icon: HiFolder,
      title: "Everything in One Place",
      description:
        "Manage customers, services, quotations, invoices, and payments from a single platform. All records are linked for complete transaction history.",
      color: "text-purple-600",
      bg: "bg-purple-50",
      borderHover: "hover:border-purple-400",
      shadowHover: "hover:shadow-purple-500/10",
    },
    {
      icon: HiChartBar,
      title: "Know Your Numbers Instantly",
      description:
        "Track total revenue, outstanding payments, and invoice statuses with visual charts. Make informed decisions without spreadsheets.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderHover: "hover:border-amber-400",
      shadowHover: "hover:shadow-amber-500/10",
    },
    {
      icon: HiSwitchHorizontal,
      title: "Quotation to Invoice in Seconds",
      description:
        "Convert approved quotations into invoices instantly. No double data entry — the system carries over all line items automatically.",
      color: "text-red-600",
      bg: "bg-red-50",
      borderHover: "hover:border-red-400",
      shadowHover: "hover:shadow-red-500/10",
    },
    {
      icon: HiShieldCheck,
      title: "Type-Safe & Error-Free",
      description:
        "Shared TypeScript types and Zod validation across frontend and backend prevent bad data, reduce bugs, and keep your records accurate.",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      borderHover: "hover:border-cyan-400",
      shadowHover: "hover:shadow-cyan-500/10",
    },
    {
      icon: HiLockClosed,
      title: "Control Who Accesses What",
      description:
        "Admin and User roles protect sensitive operations. Only authorized team members can create, edit, or delete critical business data.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      borderHover: "hover:border-indigo-400",
      shadowHover: "hover:shadow-indigo-500/10",
    },
    {
      icon: HiDeviceMobile,
      title: "Multi-Channel Notifications",
      description:
        "Reach clients where they are. Send invoice reminders and overdue alerts through both email and WhatsApp for faster payment response.",
      color: "text-pink-600",
      bg: "bg-pink-50",
      borderHover: "hover:border-pink-400",
      shadowHover: "hover:shadow-pink-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-20" id="benefits">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-16">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:sticky lg:top-24"
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
              <span>Key Benefits</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4"
            >
              <span className="text-text-primary">Why Choose Our Invoice</span>
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Management System?
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
              Designed to simplify your workflow, improve accuracy, and help
              your business grow.
            </motion.p>
          </motion.div>

          {/* Right Side - Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 + index * 0.06,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`group p-4 sm:p-5 rounded-2xl cursor-pointer bg-white border border-border shadow-sm transition-all duration-300 ${benefit.borderHover} hover:shadow-lg ${benefit.shadowHover}`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${benefit.bg}`}
                >
                  <benefit.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${benefit.color}`}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold mb-1.5 tracking-tight text-text-primary">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs leading-relaxed text-text-secondary">
                  {benefit.description}
                </p>

                {/* Learn More Link (appears on hover) */}
                <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span
                    className={`text-[11px] font-semibold ${benefit.color}`}
                  >
                    Learn more
                  </span>
                  <svg
                    className={`w-3 h-3 ${benefit.color}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefit;
