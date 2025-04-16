"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for San Roque image.
const sanRoqueImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807833/sanroque_tk0bxj.png"

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
    >
      {children}
    </motion.div>
  )
}

const SanRoque: React.FC = () => {
  return (
    <section className="min-h-screen bg-white text-[#1a1a1a] p-5 md:p-10 space-y-10">
      <h3 className="uppercase font-general text-xs pt-10 text-[#666666]">
        Cultural Heritage
      </h3>
      <h1 className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#1a1a1a] font-light italic">
        S<b>a</b>n Roq<b>u</b>e Legacy
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#666666] text-start font-medium">
                Historical Significance
              </h3>
            </div>
            <p className="text-base text-[#666666] leading-relaxed mb-6 max-w-lg">
              Discover the rich history and cultural significance of San Roque. From its architectural marvels to the storied past that continues to inspire generations, San Roque remains a beacon of historical legacy.
            </p>
            <Link href="/homepage/sanroque">
              <div className="flex items-center text-[#666666] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">
                  More About
                </span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </div>
            </Link>
          </Tilt>

          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-neutral-200 p-5 bg-[#f5f5f5] rounded-lg">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[5rem] md:text-[8rem] leading-none font-light italic">
              Cult<b>u</b>ral
              <br />
              Her<b>i</b>tage
            </h1>
            <div className="p-5">
              <h3 className="text-[#666666] text-end font-medium">
                Preserving Traditions
              </h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={sanRoqueImageUrl}
                alt="San Roque historical view"
                className="object-cover object-center"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#666666] text-start font-medium">
                Architectural Marvel
              </h3>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-3xl md:text-5xl font-light italic">
                Timeless Beauty
              </h1>
            </div>
          </Tilt>

          <Tilt className="p-5 border flex flex-col rounded-lg border-neutral-200">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Hist<b>o</b>rical
              <br />
              Elem<b>e</b>nts
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#666666]">
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
    </section>
  )
}

export default SanRoque;
