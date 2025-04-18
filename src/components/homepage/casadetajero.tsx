"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for Casa De Tajero image.
const casaDeTajeroImageUrl = "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807694/casadetajero_dic0mo.png"

// Reusable Tilt component using Framer Motion for a 3D hover effect.
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

const CasaDeTajero: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAE8B4]/30 to-white text-[#574A24] p-5 md:p-10 space-y-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      {/* Decorative architectural elements */}
      <div className="absolute top-20 right-20 w-40 h-40 border border-[#CBBD93]/30 rounded-none rotate-45 opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 border border-[#CBBD93]/30 rounded-none rotate-45 opacity-20"></div>

      <motion.h3
        className="uppercase font-general text-xs pt-10 text-[#80775C]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Architectural Heritage
      </motion.h3>

      <motion.h1
        className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#574A24] font-light italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Casa Hacienda <span className="text-[#80775C]">Tejeros</span>
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          {/* Card: Image with overlay */}
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-[#574A24]/20 to-transparent z-10"></div>
              <Image
                src={casaDeTajeroImageUrl || "/placeholder.svg"}
                alt="Casa De Tajero historical view"
                className="object-cover object-center sepia-[0.15]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5 bg-white">
              <h3 className="text-[#80775C] text-start font-medium">Historical Landmark</h3>
              <h1 className="plain-heading special-font text-[#574A24] text-3xl md:text-5xl font-light italic">
                Captivating <span className="text-[#80775C]">Heritage</span>
              </h1>
            </div>
          </Tilt>

          {/* Card: Year of Construction */}
          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-[#CBBD93] p-5 bg-[#CBBD93]/10 rounded-lg">
            <h1 className="plain-heading special-font text-[#574A24] text-[4rem] md:text-[6rem] leading-none font-light italic">
              Est. 18<b className="text-[#80775C]">70</b>
            </h1>
            <div className="p-5">
              <h3 className="text-[#80775C] text-end font-medium">Year of Construction</h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          {/* Card: Cultural Significance */}
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#80775C] text-start font-medium">Cultural Significance</h3>
            </div>
            <p className="text-base text-[#574A24]/80 leading-relaxed mb-6 max-w-lg">
              Casa De Tajero is a captivating historical landmark that encapsulates the rich cultural heritage of the
              region. With its unique architecture and storied past, this site continues to inspire visitors and
              preserve its legacy.
            </p>
            <Link href="/homepage/casadetajero">
              <div className="flex items-center text-[#80775C] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">More About</span>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ArrowRight size={16} className="transition-transform duration-300" />
                </motion.div>
              </div>
            </Link>
          </Tilt>

          {/* Card: Architectural Features */}
          <Tilt className="p-5 border flex flex-col rounded-lg border-[#CBBD93] bg-white">
            <h1 className="plain-heading special-font text-[#574A24] text-[3rem] md:text-[4rem] max-w-sm leading-none text-start font-light italic">
              Architectural
              <br />
              Feat<b className="text-[#80775C]">u</b>res
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#80775C]">
              Colonial design
              <br />
              Ornate woodwork
              <br />
              Stone foundations
              <br />
              Period furnishings
              <br />
              Courtyard layout
              <br />
              Historical artifacts
            </p>
          </Tilt>

          {/* Card: Preservation Efforts */}
          <Tilt className="bg-[#CBBD93]/10 rounded-lg relative overflow-hidden border border-[#CBBD93]">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#80775C] text-start font-medium">
                  Preservation
                  <br />
                  efforts
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#574A24] text-[3rem] px-4 md:text-[5rem] leading-none md:leading-[5rem] text-start font-light italic">
                Liv<b className="text-[#80775C]">i</b>ng
                <br />
                Hist<b className="text-[#80775C]">o</b>ry
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
              <div className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"></div>
              <Image
                src={casaDeTajeroImageUrl || "/placeholder.svg"}
                alt="Casa De Tajero detail"
                className="object-cover object-bottom opacity-30 sepia-[0.15]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>
        </div>
      </div>

      {/* Decorative architectural pattern */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDIwIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI4IiBmaWxsPSIjQ0JCRDkzIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIxMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIGZpbGw9IiNDQkJEOTMiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-30"></div>
    </section>
  )
}

export default CasaDeTajero
