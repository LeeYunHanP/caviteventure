"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for the sketch image.
const binakayanImageUrl = "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807478/binakayansketch_cco2ap.png"

// A reusable Tilt component that applies a 3D hover effect via motion values.
interface TiltProps {
  children: React.ReactNode
  className?: string
}

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

const Binakayan: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#FAE8B4]/20 text-[#574A24] p-5 md:p-10 space-y-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      <motion.h3
        className="uppercase font-general text-xs pt-10 text-[#80775C]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Historical Significance
      </motion.h3>

      <motion.h1
        className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#574A24] font-light italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        The Battle of Binak<b className="text-[#80775C]">a</b>yan
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-28">
          {/* Card 1: Year with Image */}
          <Tilt className="flex border border-[#CBBD93] w-auto rounded-lg max-w-xl overflow-hidden bg-white">
            <div className="p-5">
              <h3 className="text-[#80775C]">Year</h3>
              <h1 className="plain-heading special-font text-3xl md:text-9xl text-[#574A24] font-light italic">
                18<b className="text-[#80775C]">96</b>
              </h1>
            </div>
            <div className="relative h-auto w-48 md:w-64">
              <div className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"></div>
              <Image
                src={binakayanImageUrl || "/placeholder.svg"}
                alt="Binakayan historical sketch"
                className="object-cover object-center h-full sepia-[0.2]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>

          {/* Card 2: Victory */}
          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-[#CBBD93] p-5 bg-[#CBBD93]/20 rounded-lg max-w-xl">
            <h1 className="plain-heading special-font text-[#574A24] text-[5rem] md:text-[10rem] leading-none font-light italic">
              Vic<b className="text-[#80775C]">t</b>ory
            </h1>
            <div className="p-5">
              <h3 className="text-[#80775C] text-end font-medium">Against Colonial Powers</h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          {/* Card 3: Historical Significance */}
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#80775C] text-start font-medium">Historical Significance</h3>
            </div>
            <p className="text-base text-[#574A24]/80 leading-relaxed mb-6 max-w-lg">
              The Battle of Binakayan marks a significant moment in Philippine history, showcasing the resilience and
              strategic brilliance of Filipino forces. This historical event represents one of the most decisive
              victories against colonial powers and continues to be celebrated as a symbol of national pride.
            </p>
            <Link href="/homepage/binakayan">
              <div className="flex items-center text-[#80775C] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">More About</span>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ArrowRight size={16} className="transition-transform duration-300" />
                </motion.div>
              </div>
            </Link>
          </Tilt>

          {/* Card 4: Strategic Brilliance */}
          <Tilt className="p-5 border flex flex-col rounded-lg border-[#CBBD93] bg-white">
            <h1 className="plain-heading special-font text-[#574A24] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Str<b className="text-[#80775C]">a</b>tegic Brill<b className="text-[#80775C]">i</b>ance
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#80775C]">
              Military tactics
              <br />
              Local knowledge
              <br />
              Resourcefulness
              <br />
              Unity of forces
              <br />
              Defensive positions
              <br />
              Guerrilla warfare
            </p>
          </Tilt>

          {/* Card 5: Filipino Fighters Involved */}
          <Tilt className="bg-[#CBBD93]/20 rounded-lg relative overflow-hidden border border-[#CBBD93]">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#80775C] text-start font-medium">
                  Filipino fighters
                  <br />
                  involved
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#574A24] text-[5rem] px-4 md:text-[12rem] leading-none md:leading-[10rem] text-start font-light italic">
                1000<b className="text-[#80775C]">+</b>
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
              <div className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"></div>
              <Image
                src={binakayanImageUrl || "/placeholder.svg"}
                alt="Binakayan historical sketch"
                className="object-cover object-bottom opacity-30 sepia-[0.2]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#CBBD93]/20 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#CBBD93]/20 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#CBBD93]/20 rounded-full opacity-30 pointer-events-none"></div>
    </section>
  )
}

export default Binakayan
