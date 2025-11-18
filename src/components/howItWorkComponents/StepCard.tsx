// components/StepCard.tsx
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StepCardProps = {
  number: number;
  icon: any;
  title: string;
  color: string;
  items: string[];
};

export default function StepCard({ number, icon, title, color, items }: StepCardProps) {
  return (
    <motion.div variants={{ hidden: {}, visible: {} }} className="h-full">
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-12 h-12 rounded-full ${color}-100 dark:${color}-900/30 flex items-center justify-center flex-shrink-0`}
            >
              {icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white flex items-center">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`bg-${color}-100 dark:bg-${color}-900/50 text-${color}-600 dark:text-${color}-400 w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm font-bold`}
                >
                  {number}
                </motion.span>
                {title}
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {items.map((text, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
