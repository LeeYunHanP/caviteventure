"use client"

import type React from "react"
import { motion, useMotionValue } from "framer-motion"
import AnimatedTitle from "./animatedtitle"

export default function FloatingImage() {
  // Motion values for rotation
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Shared spring config
  const spring = { type: "spring", stiffness: 300, damping: 20 }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    rotateY.set(((x - cx) / cx) * 10)
    rotateX.set(((y - cy) / cy) * -10)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  // initial opacity as a motion value
  const overlayOpacity = useMotionValue(0.3)

  return (
    <section
      id="story"
      className="min-h-screen w-screen bg-gradient-to-br from-[#FAE8B4] to-[#CBBD93]/70 flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-[#574A24]/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-[#574A24]/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjNTc0QTI0IiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM1NzRBMjQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <p className="font-general text-sm uppercase md:text-[10px] text-[#574A24] tracking-wider text-center mb-2">
          Explore Cavite&apos;s Rich Heritage
        </p>

        <div className="relative w-full max-w-4xl">
          <AnimatedTitle
            title="The St<span>o</span>ry of <br /> Our Hist<span>o</span>rical Legacy"
            containerClass="mt-5 pointer-events-none text-center text-4xl md:text-6xl !text-[#574A24]"
          />

          <motion.div
            className="mt-12 mx-auto w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#CBBD93]/30"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 600 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(87, 74, 36, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="relative w-full h-full">
              <motion.div
                className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"
                style={{
                  opacity: overlayOpacity,
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                transition={spring}
              />
              <motion.img
                src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744777448/product-image_ltfqke.png"
                alt="Historical Cavite Illustration"
                className="w-full h-full object-cover"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                transition={spring}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-[-5rem] w-full max-w-4xl flex justify-center md:justify-end relative z-10"
      >
        <div className="bg-[#574A24]/90 backdrop-blur-sm p-6 rounded-lg text-center md:text-left border border-[#CBBD93]/20 shadow-lg">
          <p className="text-lg md:text-xl text-[#FAE8B4] leading-relaxed">
            Where history comes alive, lies Cavite and its boundless cultural treasures. Discover the secrets of our
            past and shape your understanding of Filipino heritage amidst these historical landmarks.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
