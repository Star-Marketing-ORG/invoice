import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded ${className}`}
      style={{ backgroundSize: "200% 100%" }}
      animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-border p-6">
      <div className="space-y-4">{children}</div>
    </div>
  );
}
