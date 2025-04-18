"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for San Roque image.
const sanRoqueImageUrl = "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807833/sanroque_tk0bxj.png"

interface TiltProps {
  children: React.ReactNode
  className?: string
}

// Reusable Tilt component using Framer Motion motion values for a 3D effect.
const Tilt: React.FC<TiltProps> = ({ children, className = "" }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xOffset = e.clientX - (rect.left + rect.width / 2)
    const yOffset = e.clientY - (rect.top + rect.height / 2)
    x.set(xOffset * 0.1)
    y.set(yOffset * 0.1)
    rotateY.set(xOffset / 15)
    rotateX.set(-yOffset / 15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 600,
      }}
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(87, 74, 36, 0.1), 0 8px 10px -6px rgba(87, 74, 36, 0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

const SanRoque: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#FAE8B4]/10 text-[#574A24] p-5 md:p-10 space-y-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjQ0JCRDkzIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNDQkJEOTMiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      {/* Cultural pattern decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50,0 C77.6142,0 100,22.3858 100,50 C100,77.6142 77.6142,100 50,100 C22.3858,100 0,77.6142 0,50 C0,22.3858 22.3858,0 50,0 Z M50,10 C27.9086,10 10,27.9086 10,50 C10,72.0914 27.9086,90 50,90 C72.0914,90 90,72.0914 90,50 C90,27.9086 72.0914,10 50,10 Z"
            fill="#80775C"
          />
          <path
            d="M50,20 C66.5685,20 80,33.4315 80,50 C80,66.5685 66.5685,80 50,80 C33.4315,80 20,66.5685 20,50 C20,33.4315 33.4315,20 50,20 Z M50,30 C39.0589,30 30,39.0589 30,50 C30,60.9411 39.0589,70 50,70 C60.9411,70 70,60.9411 70,50 C70,39.0589 60.9411,30 50,30 Z"
            fill="#80775C"
          />
          <circle cx="50" cy="50" r="10" fill="#80775C" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L100,0 L100,100 L0,100 L0,0 Z M10,10 L10,90 L90,90 L90,10 L10,10 Z" fill="#574A24" />
          <path d="M20,20 L80,20 L80,80 L20,80 L20,20 Z M30,30 L30,70 L70,70 L70,30 L30,30 Z" fill="#574A24" />
          <rect x="40" y="40" width="20" height="20" fill="#574A24" />
        </svg>
      </div>

      <motion.h3
        className="uppercase font-general text-xs pt-10 text-[#80775C]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Cultural Heritage
      </motion.h3>

      <motion.h1
        className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#574A24] font-light italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        S<span className="text-[#80775C]">a</span>n Roq<span className="text-[#80775C]">u</span>e Legacy
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#80775C] text-start font-medium">Historical Significance</h3>
            </div>
            <p className="text-base text-[#574A24]/80 leading-relaxed mb-6 max-w-lg">
              Discover the rich history and cultural significance of San Roque. From its architectural marvels to the
              storied past that continues to inspire generations, San Roque remains a beacon of historical legacy.
            </p>
            <Link href="/homepage/sanroque">
              <div className="flex items-center text-[#80775C] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">More About</span>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ArrowRight size={16} className="transition-transform duration-300" />
                </motion.div>
              </div>
            </Link>
          </Tilt>

          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-[#CBBD93] p-5 bg-[#CBBD93]/10 rounded-lg">
            <h1 className="plain-heading special-font text-[#574A24] text-[5rem] md:text-[8rem] leading-none font-light italic">
              Cult<span className="text-[#80775C]">u</span>ral
              <br />
              Her<span className="text-[#80775C]">i</span>tage
            </h1>
            <div className="p-5">
              <h3 className="text-[#80775C] text-end font-medium">Preserving Traditions</h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-[#574A24]/20 to-transparent z-10"></div>
              <Image
                src={sanRoqueImageUrl || "/placeholder.svg"}
                alt="San Roque historical view"
                className="object-cover object-center sepia-[0.15]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#80775C] text-start font-medium">Architectural Marvel</h3>
              <h1 className="plain-heading special-font text-[#574A24] text-3xl md:text-5xl font-light italic">
                Timeless <span className="text-[#80775C]">Beauty</span>
              </h1>
            </div>
          </Tilt>

          <Tilt className="p-5 border flex flex-col rounded-lg border-[#CBBD93] bg-white">
            <h1 className="plain-heading special-font text-[#574A24] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Hist<span className="text-[#80775C]">o</span>rical
              <br />
              Elem<span className="text-[#80775C]">e</span>nts
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#80775C]">
              Colonial architecture
              <br />
              Religious significance
              <br />
              Community gatherings
              <br />
              Traditional festivals
              <br />
              Historical landmarks
              <br />
              Cultural preservation
            </p>
          </Tilt>
        </div>
      </div>

      {/* Decorative cultural pattern at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#CBBD93]/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNCIgdmlld0JveD0iMCAwIDI0IDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wLDAgTDQsMCBMMiw0IEwwLDAgWiBNNCwwIEw4LDAgTDYsNCBMNCwwIFogTTgsMCBMMTIsMCBMMTAsNCBMOCwwIFogTTEyLDAgTDE2LDAgTDE0LDQgTDEyLDAgWiBNMTYsMCBMMjAsMCBMMTgsNCBMMTYsMCBaIE0yMCwwIEwyNCwwIEwyMiw0IEwyMCwwIFoiIGZpbGw9IiM4MDc3NUMiIGZpbGwtb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPg==')] opacity-50"></div>
      </div>
    </section>
  )
}

export default SanRoque
