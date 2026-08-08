import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiCode, HiPlay, HiArrowRight, HiSparkles } from "react-icons/hi";

const CTA = () => {
  return (
    <section className="relative overflow-hidden pb-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl bg-[radial-gradient(circle,var(--color-brand),transparent)]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-brand-light text-brand"
        >
          <HiSparkles className="w-4 h-4" />
          <span>Get Started Today</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6"
        >
          <span className="text-text-primary">Ready to Simplify Your</span>
          <br />
          <span className="bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Billing?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base leading-relaxed mb-10 max-w-2xl mx-auto text-text-secondary"
        >
          Take control of your invoices, quotations, customers, and payments
          with a streamlined solution designed to make everyday business
          operations easier and more organised.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl text-white w-full sm:w-auto bg-brand shadow-lg shadow-brand/25 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <HiCode className="w-4 h-4" />
              GitHub Code
              <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.a>

          {/* Secondary Button - View Demo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl w-full sm:w-auto text-text-primary border border-border bg-white hover:bg-surface-hover transition-all duration-300"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <HiPlay className="w-3 h-3" />
              </span>
              View Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
