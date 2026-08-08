import { motion } from "framer-motion";
import About from "../../components/LPComponent/About";
import Banner from "../../components/LPComponent/Banner";
import Benefit from "../../components/LPComponent/Benefit";
import CTA from "../../components/LPComponent/CTA";
import Feature from "../../components/LPComponent/Feature";
import Footer from "../../components/LPComponent/Footer";
import Navbar from "../../components/LPComponent/Navbar";

const LPHomepage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Global Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Top-right blob - Large blue */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-100/40 blur-3xl"
        />

        {/* Bottom-left blob - Large purple */}
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] rounded-full bg-purple-100/30 blur-3xl"
        />

        {/* Center-left blob - Medium emerald */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-100/25 blur-3xl"
        />

        {/* Center-right blob - Medium amber */}
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-2/3 -right-20 w-[450px] h-[450px] rounded-full bg-amber-100/25 blur-3xl"
        />

        {/* Top-center blob - Small cyan */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-100/30 blur-3xl"
        />

        {/* Middle blob - Small rose */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-rose-100/25 blur-3xl"
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Navbar />
        <Banner />
        <About />
        <Feature />
        <Benefit />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default LPHomepage;
