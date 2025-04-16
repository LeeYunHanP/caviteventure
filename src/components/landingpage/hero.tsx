"use client"

import { useRef, useState } from "react"
import Image, { type ImageLoader } from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Playfair_Display } from 'next/font/google'
import { X } from 'lucide-react'

/**
 * Cloudinary Image Loader
 * Adds `f_auto,q_auto` for format/quality plus width‑based resizing
 */
const cloudinaryLoader: ImageLoader = ({ src, width }) => {
  const url = new URL(src)
  const [beforeUpload, afterUpload] = url.pathname.split("/upload/")
  const base = `${beforeUpload}/upload/`
  const rest = afterUpload ?? ""

  // width === 0 happens with <Image fill>. Skip w_ when that occurs.
  const transformation = width
    ? `f_auto,q_auto,w_${width},dpr_auto`
    : `f_auto,q_auto,dpr_auto`

  url.pathname = `${base}${transformation}/${rest}`
  return url.toString()
}

// Cloudinary assets (raw URLs)
const arrowIconSrc =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744771862/next_sfafnw.png"
const cogImageSrc =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744771850/cog_ll6ckj.jpg"

// Google Font
const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Scroll‑linked parallax for the cog image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  })
  
  const translateY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 45])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1])

  return (
    <section
      ref={heroRef}
      className="relative pt-24 pb-40 md:pt-32 md:pb-48 lg:pt-36 lg:pb-64 xl:pt-40 xl:pb-72 overflow-hidden"
    >
      {/* Background with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f4e3] via-[#f2e9d0] to-[#eaeefe] z-0" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#f2d9a9]/20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#d9e3ff]/30 blur-3xl" />
      
      <div className="container relative z-10 px-6 sm:px-10 mx-auto lg:px-20 xl:px-40 2xl:px-56 max-w-screen-8xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Text Column */}
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center border border-[#d0b88a]/30 px-5 py-2 rounded-full tracking-tight bg-white/80 backdrop-blur-sm text-base sm:text-lg shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-[#d0b88a] mr-2"></span>
                CaviteVenture 2.0 is here
              </span>
            </motion.div>

            <motion.h1 
              className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mt-8`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-[#5D4037] via-[#8D6E63] to-[#A1887F] text-transparent bg-clip-text">
                Pathway to
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#5D4037] to-[#8D6E63] text-transparent bg-clip-text">
                Modern Exhibit
              </span>
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg lg:text-xl xl:text-2xl text-[#5D4037]/80 mt-6 max-w-lg lg:max-w-2xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Explore with an app designed to track your progress and inspire your journey through Cavite&apos;s rich history.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 items-center mt-10 w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button 
                  className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full text-base sm:text-lg bg-[#5D4037] text-[#F2E4C9] shadow-lg shadow-[#5D4037]/20 hover:shadow-xl hover:shadow-[#5D4037]/30 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Explore for Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#5D4037] to-[#8D6E63] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>
              </Link>

              <motion.button
                className="flex items-center gap-3 w-full sm:w-auto justify-center text-base sm:text-lg text-[#5D4037] hover:text-[#8D6E63] transition-colors duration-300"
                onClick={() => setModalOpen(true)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Learn More</span>
                <Image
                  loader={cloudinaryLoader}
                  src={arrowIconSrc || "/placeholder.svg"}
                  alt="Arrow icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 lg:h-7 lg:w-7"
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Cog Image Column */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative w-72 sm:w-96 lg:w-[32rem] xl:w-[40rem]"
              style={{ 
                y: translateY,
                rotateZ: rotateZ,
                scale: scale
              }}
            >
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#d0b88a]/30 animate-spin-slow" 
                style={{ animationDuration: '30s' }} />
              
              {/* Main image with glow effect */}
              <div className="relative rounded-full overflow-hidden shadow-2xl shadow-[#5D4037]/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5D4037]/10 to-transparent mix-blend-overlay z-10" />
                <Image
                  loader={cloudinaryLoader}
                  src={cogImageSrc || "/placeholder.svg"}
                  alt="Innovation Cog"
                  width={640}
                  height={640}
                  priority
                  className="object-contain rounded-full"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalOpen(false)}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-3xl w-full relative"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-[#5D4037] transition-colors"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-1 bg-gradient-to-r from-[#d0b88a] to-[#eaeefe] mx-auto mb-8 rounded-full" />
              
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold mb-6 text-[#5D4037]`}>
                About Cavite Venture
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Cavite Venture is an innovative platform promoting historical and attraction sites within Cavite. 
                With interactive exhibits and an intuitive design, you can explore and trace your journey effortlessly.
              </p>
              
              <div className="mt-10">
                <motion.button
                  className="px-8 py-3 rounded-full bg-[#5D4037] text-[#F2E4C9] hover:bg-[#8D6E63] transition-colors duration-300 shadow-lg shadow-[#5D4037]/20"
                  onClick={() => setModalOpen(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
