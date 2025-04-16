"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for the sketch image.
const binakayanImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744807478/binakayansketch_cco2ap.png"

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
    >
      {children}
    </motion.div>
  )
}

const Binakayan: React.FC = () => {
  return (
    <section className="min-h-screen bg-white text-[#1a1a1a] p-5 md:p-10 space-y-10">
      <h3 className="uppercase font-general text-xs pt-10 text-[#666666]">
        Historical Significance
      </h3>
      <h1 className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#1a1a1a] font-light italic">
        The Battle of Binak<b>a</b>yan
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex flex-col w-full gap-10 items-end mt-28">
          {/* Card 1: Year with Image */}
          <Tilt className="flex border border-neutral-200 w-auto rounded-lg max-w-xl overflow-hidden">
            <div className="p-5">
              <h3 className="text-[#666666]">Year</h3>
              <h1 className="plain-heading special-font text-3xl md:text-9xl text-[#1a1a1a] font-light italic">
                18<b>96</b>
              </h1>
            </div>
            <div className="relative h-auto w-48 md:w-64">
              <Image
                src={binakayanImageUrl}
                alt="Binakayan historical sketch"
                className="object-cover object-center h-full"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>

          {/* Card 2: Victory */}
          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-neutral-200 p-5 bg-[#f5f5f5] rounded-lg max-w-xl">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[5rem] md:text-[10rem] leading-none font-light italic">
              Vic<b>t</b>ory
            </h1>
            <div className="p-5">
              <h3 className="text-[#666666] text-end font-medium">
                Against Colonial Powers
              </h3>
            </div>
          </Tilt>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-10 items-start">
          {/* Card 3: Historical Significance */}
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#666666] text-start font-medium">
                Historical Significance
              </h3>
            </div>
            <p className="text-base text-[#666666] leading-relaxed mb-6 max-w-lg">
              The Battle of Binakayan marks a significant moment in Philippine history,
              showcasing the resilience and strategic brilliance of Filipino forces. This
              historical event represents one of the most decisive victories against
              colonial powers and continues to be celebrated as a symbol of national pride.
            </p>
            <Link href="/homepage/binakayan">
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

          {/* Card 4: Strategic Brilliance */}
          <Tilt className="p-5 border flex flex-col rounded-lg border-neutral-200">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Str<b>a</b>tegic Brill<b>i</b>ance
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#666666]">
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
          <Tilt className="bg-[#f5f5f5] rounded-lg relative overflow-hidden">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#666666] text-start font-medium">
                  Filipino fighters
                  <br />
                  involved
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-[5rem] px-4 md:text-[12rem] leading-none md:leading-[10rem] text-start font-light italic">
                1000<b>+</b>
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
              <Image
                src={binakayanImageUrl}
                alt="Binakayan historical sketch"
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

export default Binakayan;
