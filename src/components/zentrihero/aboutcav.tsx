"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import AnimatedTitle from "./animatedtitle"
import { ChevronUp } from "lucide-react"

export default function About() {
  // ref to the clip section
  const clipRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // scroll progress within that section
  const { scrollYProgress } = useScroll({
    target: clipRef,
    offset: ["start center", "end center"],
  })

  // map scroll [0→1] to mask size & shape
  const clipWidth = useTransform(scrollYProgress, [0, 1], ["50vw", "100vw"])
  const clipHeight = useTransform(scrollYProgress, [0, 1], ["50vh", "100vh"])
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["50%", "0%"])
  const imageBrightness = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const imageSepia = useTransform(scrollYProgress, [0, 1], [0.3, 0])

  // fade‑in variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
    }),
  }

  // back‑to‑top button
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-screen overflow-hidden bg-gradient-to-b from-[#FAE8B4]/20 to-white"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[5%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#CBBD93]/10"
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
          className="absolute bottom-[15%] right-[10%] w-40 h-40 md:w-56 md:h-56 rounded-full bg-[#CBBD93]/10"
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
      </div>

      {/* Intro text */}
      <div className="relative z-10 mb-8 mt-36 flex flex-col items-center gap-5 px-4 sm:px-8">
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-[#CBBD93]/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "40%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <motion.p
          className="font-general text-sm uppercase md:text-[10px] text-[#80775C] tracking-wider"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
        >
          Welcome to Cavite Venture
        </motion.p>

        <AnimatedTitle
          title="Disc<span>o</span>ver the world&apos;s <br /> largest shared <span>a</span>dventure"
          containerClass="mt-5 !text-[#574A24] text-center"
        />

        <motion.div
          className="about-subtext text-center space-y-4 max-w-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fadeIn}
        >
          <p className="text-[#574A24] font-medium">
            The Game of Games begins—your life, now an epic ADVENTURE
          </p>
          <p className="text-[#80775C]">
            Cavite unites every player from countless games and platforms, both digital and physical, into a unified
            Play Economy
          </p>
        </motion.div>

        <motion.div
          className="w-20 h-20 mt-8 opacity-30"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="#574A24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Sticky clip‐mask section */}
      <div ref={clipRef} className="sticky top-0 h-screen w-screen flex items-center justify-center">
        <motion.div
          style={{ width: clipWidth, height: clipHeight, borderRadius }}
          className="relative overflow-hidden shadow-2xl"
        >
          <motion.div
            className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"
            style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0]) }}
          />
          <motion.img
            src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808992/DSC_0018_5_wtcrpj.jpg"
            alt="Binakayan Battle Scene"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: `brightness(${imageBrightness}) sepia(${imageSepia})`,
              scale: useTransform(scrollYProgress, [0, 1], [1.1, 1]),
            }}
          />
        </motion.div>
      </div>

      {/* Content after image */}
      <div className="relative z-10 py-20 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-[#574A24] border-l-4 border-[#CBBD93] pl-4">Our Mission</h3>
            <p className="text-[#80775C] leading-relaxed">
              To preserve and showcase the rich cultural heritage of Cavite through immersive experiences that educate,
              inspire, and connect visitors with the region&apos;s storied past. We aim to make history accessible and
              engaging for all generations.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-[#574A24] border-l-4 border-[#CBBD93] pl-4">Our Vision</h3>
            <p className="text-[#80775C] leading-relaxed">
              To become the premier destination for historical tourism in the Philippines, where visitors can embark on
              a journey through time, experiencing the pivotal moments and cultural treasures that have shaped
              Cavite&apos;s identity and contributed to the nation&apos;s history.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-20 rounded-full bg-[#574A24] p-3 text-[#FAE8B4] shadow-lg hover:bg-[#80775C] transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
