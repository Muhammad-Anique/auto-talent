"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UnderConstruction() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Avoid rendering on the server

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6"
      >
        <motion.h1
          className="text-5xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          🚧 Under Construction 🚧
        </motion.h1>
        <p className="text-xl">
          We’re working hard to launch something amazing. Stay tuned!
        </p>

        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 text-white bg-[#5b6949] px-6 py-3 font-semibold rounded-lg shadow-lg hover:bg-[#5b6949]/90"
          >
            Go to Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
