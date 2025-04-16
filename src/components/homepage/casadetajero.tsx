"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for Casa De Tajero image.
const casaDeTajeroImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807694/casadetajero_dic0mo.png"

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
    >
      {children}
    </motion.div>
  )
}

const CasaDeTajero: React.FC = () => {
  return (
    <section className="min-h-screen bg-white text-[#1a1a1a] p-5 md:p-10 space-y-10">
      <h3 className="uppercase font-general text-xs pt-10 text-[#666666]">
        Architectural Heritage
      </h3>
      <h1 className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#1a1a1a] font-light italic">
        Casa Hacienda Tejeros
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          {/* Card: Image with overlay */}
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={casaDeTajeroImageUrl}
                alt="Casa De Tajero historical view"
                className="object-cover object-center"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#666666] text-start font-medium">
                Historical Landmark
              </h3>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-3xl md:text-5xl font-light italic">
                Captivating Heritage
              </h1>
            </div>
          </Tilt>

          {/* Card: Year of Construction */}
          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-neutral-200 p-5 bg-[#f5f5f5] rounded-lg">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[4rem] md:text-[6rem] leading-none font-light italic">
              Est. 18<b>70</b>
            </h1>
            <div className="p-5">
              <h3 className="text-[#666666] text-end font-medium">
                Year of Construction
              </h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          {/* Card: Cultural Significance */}
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#666666] text-start font-medium">
                Cultural Significance
              </h3>
            </div>
            <p className="text-base text-[#666666] leading-relaxed mb-6 max-w-lg">
              Casa De Tajero is a captivating historical landmark that encapsulates the rich cultural heritage of the region. With its unique architecture and storied past, this site continues to inspire visitors and preserve its legacy.
            </p>
            <Link href="/homepage/casadetajero">
              <div className="flex items-center text-[#666666] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">
                  More About
                </span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </Link>
          </Tilt>

          {/* Card: Architectural Features */}
          <Tilt className="p-5 border flex flex-col rounded-lg border-neutral-200">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] md:text-[4rem] max-w-sm leading-none text-start font-light italic">
              Architectural
              <br />
              Feat<b>a</b>tures
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#666666]">
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
          <Tilt className="bg-[#f5f5f5] rounded-lg relative overflow-hidden">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#666666] text-start font-medium">
                  Preservation
                  <br />
                  efforts
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] px-4 md:text-[5rem] leading-none md:leading-[5rem] text-start font-light italic">
                Liv<b>i</b>ng
                <br />
                Hist<b>o</b>ry
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
              <Image
                src={casaDeTajeroImageUrl}
                alt="Casa De Tajero detail"
                className="object-cover object-bottom opacity-30"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  )
}

export default CasaDeTajero;
