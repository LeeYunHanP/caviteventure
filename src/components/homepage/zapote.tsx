"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for Zapote image.
const zapoteImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808019/zapotesignupimage_yjjhvk.png"

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

const Zapote: React.FC = () => {
  return (
    <section className="min-h-screen bg-white text-[#1a1a1a] p-5 md:p-10 space-y-10">
      <h3 className="uppercase font-general text-xs pt-10 text-[#666666]">
        Historical Significance
      </h3>
      <h1 className="plain-heading md:text-[8rem] text-5xl max-w-5xl md:leading-[7rem] text-[#1a1a1a] font-light italic">
        The B<b>a</b>ttle of Z<b>a</b>pote
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left side - Image and Year card */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={zapoteImageUrl}
                alt="Battle of Zapote historical image"
                className="object-cover object-center"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#666666] text-start font-medium">Pivotal Conflict</h3>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-3xl md:text-5xl font-light italic">
                Shap<span className="italic">i</span>ng Ind<span className="italic">e</span>pendence
              </h1>
            </div>
          </Tilt>

          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-neutral-200 p-5 bg-[#f5f5f5] rounded-lg">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[5rem] md:text-[10rem] leading-none font-light italic">
              18<b>97</b>
            </h1>
            <div className="p-5">
              <h3 className="text-[#666666] text-end font-medium">Year of the Battle</h3>
            </div>
          </Tilt>
        </div>

        {/* Right side - Content cards */}
        <div className="flex flex-col w-full gap-10 items-start">
          <Tilt className="flex flex-col border border-neutral-200 bg-[#f9f9f9] rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#666666] text-start font-medium">Historical Context</h3>
            </div>
            <p className="text-base text-[#666666] leading-relaxed mb-6 max-w-lg">
              The Battle of Zapote stands as a pivotal conflict in Philippine history, demonstrating the courage and
              tactical ingenuity of Filipino revolutionaries. This significant engagement against colonial forces helped
              shape the nation&apos;s path to independence and remains an enduring testament to the Filipino spirit.
            </p>
            <Link href="/homepage/zapote">
              <div className="flex items-center text-[#666666] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">More About</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </Link>
          </Tilt>

          <Tilt className="p-5 border flex flex-col rounded-lg border-neutral-200">
            <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Rev<b>o</b>lutionary C<b>o</b>urage
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#666666]">
              Tactical ingenuity
              <br />
              Strategic positioning
              <br />
              Resourceful defense
              <br />
              Coordinated attacks
              <br />
              Local knowledge
              <br />
              Patriotic determination
            </p>
          </Tilt>

          <Tilt className="bg-[#f5f5f5] rounded-lg relative overflow-hidden">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#666666] text-start font-medium">
                  Legacy of
                  <br />
                  the battle
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#1a1a1a] text-[3rem] px-4 md:text-[5rem] leading-none md:leading-[5rem] text-start font-light italic">
                End<b>u</b>ring
                <br />
                Test<b>a</b>ment
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
              <Image
                src={zapoteImageUrl}
                alt="Battle of Zapote historical image"
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

export default Zapote;
