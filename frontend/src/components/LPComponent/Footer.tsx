import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/riteshgharti333",
      label: "GitHub",
    },
    {
      icon: FaGlobe,
      href: "https://rgdev-portfolio-six.vercel.app/",
      label: "Portfolio",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/riteshgharti333",
      label: "LinkedIn",
    },
  ];

  return (
    <footer
      className="relative"
      style={{ backgroundColor: "var(--color-brand)" }}
    >
      <div className="max-w-7xl mx-auto px-2 lg:px-8">
        <div className="py-12 md:py-16 text-center">
          {/* Logo */}
          <motion.a
            href="#"
            className="inline-flex items-center gap-3 group justify-center mb-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Invoice Ready
            </span>
          </motion.a>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm leading-relaxed mb-8 max-w-md mx-auto text-white/70"
          >
            Smart invoicing solution for modern businesses. Manage invoices,
            customers, and payments with ease.
          </motion.p>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-1 mb-8"
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}

            {/* Dashboard Link using React Router */}
            <Link
              to="/dashboard"
              className="px-3 py-1.5 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
            >
              View Demo
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 border border-white/20 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-md mx-auto mb-6 border-t border-white/10" />

          {/* Copyright & Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-white/50"
          >
            <span>© {currentYear} Invoice Ready. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1">
              Made with
              <HiHeart className="w-3.5 h-3.5 text-red-400" />
              by Ritesh Gharti
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
