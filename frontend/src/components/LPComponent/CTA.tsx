import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiCode, HiPlay, HiArrowRight, HiSparkles } from "react-icons/hi";

const CTA = () => {
  return (
    <section className="relative overflow-hidden pb-20">
      <div className="relative max-w-4xl mx-auto px-2 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{
            backgroundColor: "var(--color-brand-light)",
            color: "var(--color-brand)",
          }}
        >
          <HiSparkles className="w-4 h-4" />
          <span>Get Started Today</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6"
        >
          <span style={{ color: "var(--color-text-primary)" }}>
            Ready to Simplify Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Billing?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Take control of your invoices, quotations, customers, and payments
          with a streamlined solution designed to make everyday business
          operations easier and more organised.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          {/* Primary Button - GitHub Code */}
          <motion.a
            href="https://github.com/riteshgharti333/invoice"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl text-white w-full sm:w-auto"
            style={{
              backgroundColor: "var(--color-brand)",
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)",
            }}
          >
            <HiCode className="w-4 h-4" />
            GitHub Code
            <HiArrowRight className="w-4 h-4" />
          </motion.a>

          {/* Secondary Button - View Demo */}
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl w-full sm:w-auto hover:bg-surface-hover transition-colors"
            style={{
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              backgroundColor: "white",
            }}
          >
            <HiPlay className="w-4 h-4" />
            View Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;