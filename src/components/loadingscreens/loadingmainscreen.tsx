"use client"

import { motion } from "framer-motion"
import { Landmark, Sailboat, Mountain, Sun, Cloud, TreePalmIcon as Palm } from "lucide-react"

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#fef3c7] to-[#fde68a]">
      {/* Background Elements */}
      <motion.div
        className="absolute top-10 right-10 opacity-30"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Sun className="w-16 h-16 text-amber-600" />
      </motion.div>

      <motion.div
        className="absolute top-20 left-[15%] opacity-30"
        animate={{
          x: [0, 15, 0],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Cloud className="w-12 h-12 text-amber-100" />
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-10 opacity-30"
        animate={{
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Palm className="w-14 h-14 text-[#4a6741]" />
      </motion.div>

      {/* Main Animation Container */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 flex items-center justify-center">
        {/* Outer Rotating Border */}
        <motion.div
          className="absolute w-full h-full border-[3px] sm:border-[4px] md:border-[5px] border-[#8b7b4b] rounded-full border-t-transparent"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Inner Rotating Border (opposite direction) */}
        <motion.div
          className="absolute w-[85%] h-[85%] border-[2px] sm:border-[3px] md:border-[4px] border-[#8b7b4b] rounded-full border-b-transparent"
          initial={{ rotate: 360 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Pulsing Circle Behind Landmark */}
        <motion.div
          className="absolute w-[60%] h-[60%] bg-amber-200 rounded-full opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Landmark Icon with Fade-In Scale Animation */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Landmark className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-[#8b7b4b]" />
        </motion.div>

        {/* Floating Mountain Animation */}
        <motion.div
          className="absolute top-0 left-6 md:left-8"
          initial={{ y: 0 }}
          animate={{
            y: [-10, 0, -10],
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{
            y: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          <Mountain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-[#4a6741]" />
        </motion.div>

        {/* Floating Sailboat Animation */}
        <motion.div
          className="absolute bottom-0 right-6 md:right-8"
          initial={{ x: 0 }}
          animate={{
            x: [-10, 0, -10],
            y: [0, -5, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            x: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            y: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          <Sailboat className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-[#3a5a7c]" />
        </motion.div>
      </div>

      {/* Animated Text with Underline */}
      <div className="mt-8 flex flex-col items-center">
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#8b7b4b] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          CaviteVenture
        </motion.h2>

        <motion.div
          className="h-[2px] bg-[#8b7b4b] mt-1"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        />

        {/* Loading Text */}
        <motion.p
          className="mt-3 text-sm sm:text-base text-[#8b7b4b] opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ delay: 1, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          Discovering adventures...
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingAnimation
