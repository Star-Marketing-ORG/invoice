import { motion } from "framer-motion";
import { HiTrendingUp, HiCube } from "react-icons/hi";
import { Skeleton } from "../ui/SkeletonCard";

const serviceColors = [
  { color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  { color: "text-violet-600", bg: "bg-violet-50", bar: "bg-violet-500" },
  { color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { color: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-500" },
];

interface ServiceDemand {
  name: string;
  count: number;
  percent: number;
}

interface ServiceDemandChartProps {
  data?: ServiceDemand[];
  isLoading?: boolean;
}

export default function ServiceDemandChart({
  data,
  isLoading,
}: ServiceDemandChartProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-3xl border border-border p-6">
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative overflow-hidden bg-white rounded-3xl border border-border p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full opacity-60" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-50 rounded-full opacity-60" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
            <HiTrendingUp size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">
              Most Demanded Services
            </h3>
            <p className="text-xs text-text-muted">Based on invoice count</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-text-muted">No data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => {
              const colors = serviceColors[index] || serviceColors[4];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}
                      >
                        <HiCube size={14} className={colors.color} />
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
