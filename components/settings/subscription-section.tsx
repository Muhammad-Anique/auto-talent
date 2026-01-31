"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SubscriptionSection() {
  return (
    <div className="space-y-16 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[25%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-zinc-500/10 to-zinc-500/10 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[25%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-zinc-500/10 to-zinc-500/10 blur-3xl" />
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          className={cn(
            "p-8 text-center rounded-3xl border backdrop-blur-xl relative overflow-hidden shadow-2xl",
            "border-zinc-200/50 bg-gradient-to-br from-zinc-50/80 to-white/80",
          )}
        >
          <div className="relative space-y-6">
            {/* Icon */}
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center transform transition-transform duration-300",
                  "bg-gradient-to-br from-zinc-700 to-zinc-900 hover:rotate-12",
                )}
              >
                <Trophy className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900">
                  Pro Plan Active
                </span>
              </h2>
              <p className="text-lg text-zinc-600">
                Enjoying unlimited access to all features
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Trophy, text: "Premium Features" },
                { icon: Sparkles, text: "Priority Support" },
                { icon: Star, text: "Exclusive Templates" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className={cn(
                    "p-4 rounded-xl backdrop-blur-sm border transition-all duration-300",
                    "bg-white/40 border-zinc-200 hover:border-zinc-300",
                  )}
                >
                  <item.icon className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
                  <p className="text-sm font-medium text-zinc-900">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
