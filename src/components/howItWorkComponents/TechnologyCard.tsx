import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TechnologyCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgClass: string;
}

export default function TechnologyCard({
  icon,
  title,
  description,
  iconBgClass,
}: TechnologyCardProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-16 h-16 rounded-full ${iconBgClass} flex items-center justify-center mb-4`}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}
