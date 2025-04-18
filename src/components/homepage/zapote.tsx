"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

// Use the Cloudinary URL for Zapote image.
const zapoteImageUrl = "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808019/zapotesignupimage_yjjhvk.png"

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

const Zapote: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAE8B4]/20 to-white text-[#574A24] p-5 md:p-10 space-y-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CBBD93]/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      {/* Battle-themed decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-[10%] left-[5%] w-32 h-1 bg-[#574A24] rotate-45"></div>
        <div className="absolute top-[15%] left-[10%] w-32 h-1 bg-[#574A24] rotate-45"></div>
        <div className="absolute top-[20%] left-[15%] w-32 h-1 bg-[#574A24] rotate-45"></div>

        <div className="absolute bottom-[10%] right-[5%] w-32 h-1 bg-[#574A24] -rotate-45"></div>
        <div className="absolute bottom-[15%] right-[10%] w-32 h-1 bg-[#574A24] -rotate-45"></div>
        <div className="absolute bottom-[20%] right-[15%] w-32 h-1 bg-[#574A24] -rotate-45"></div>
      </div>

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
        The B<span className="text-[#80775C]">a</span>ttle of Z<span className="text-[#80775C]">a</span>pote
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left side - Image and Year card */}
        <div className="flex flex-col w-full gap-10 items-end mt-10">
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-[#574A24]/20 to-transparent z-10"></div>
              <Image
                src={zapoteImageUrl || "/placeholder.svg"}
                alt="Battle of Zapote historical image"
                className="object-cover object-center sepia-[0.15]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#80775C] text-start font-medium">Pivotal Conflict</h3>
              <h1 className="plain-heading special-font text-[#574A24] text-3xl md:text-5xl font-light italic">
                Shap<span className="text-[#80775C]">i</span>ng Ind<span className="text-[#80775C]">e</span>pendence
              </h1>
            </div>
          </Tilt>

          <Tilt className="flex border flex-col justify-between md:h-[20rem] border-[#CBBD93] p-5 bg-[#CBBD93]/10 rounded-lg">
            <h1 className="plain-heading special-font text-[#574A24] text-[5rem] md:text-[10rem] leading-none font-light italic">
              18<span className="text-[#80775C]">97</span>
            </h1>
            <div className="p-5">
              <h3 className="text-[#80775C] text-end font-medium">Year of the Battle</h3>
            </div>
          </Tilt>
        </div>

        {/* Right side - Content cards */}
        <div className="flex flex-col w-full gap-10 items-start">
          <Tilt className="flex flex-col border border-[#CBBD93] bg-white rounded-lg p-5">
            <div className="p-2">
              <h3 className="text-[#80775C] text-start font-medium">Historical Context</h3>
            </div>
            <p className="text-base text-[#574A24]/80 leading-relaxed mb-6 max-w-lg">
              The Battle of Zapote stands as a pivotal conflict in Philippine history, demonstrating the courage and
              tactical ingenuity of Filipino revolutionaries. This significant engagement against colonial forces helped
              shape the nation&apos;s path to independence and remains an enduring testament to the Filipino spirit.
            </p>
            <Link href="/homepage/zapote">
              <div className="flex items-center text-[#80775C] font-medium group w-fit cursor-pointer">
                <span className="mr-2 uppercase text-sm tracking-wider">More About</span>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ArrowRight size={16} className="transition-transform duration-300" />
                </motion.div>
              </div>
            </Link>
          </Tilt>

          <Tilt className="p-5 border flex flex-col rounded-lg border-[#CBBD93] bg-white">
            <h1 className="plain-heading special-font text-[#574A24] text-[3rem] md:text-[4.5rem] max-w-sm leading-none text-start font-light italic">
              Rev<span className="text-[#80775C]">o</span>lutionary C<span className="text-[#80775C]">o</span>urage
            </h1>
            <p className="text-end font-general uppercase text-xs pt-10 text-[#80775C]">
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

          <Tilt className="bg-[#CBBD93]/10 rounded-lg relative overflow-hidden border border-[#CBBD93]">
            <div className="p-5 z-10 relative">
              <div className="p-2">
                <h3 className="text-[#80775C] text-start font-medium">
                  Legacy of
                  <br />
                  the battle
                </h3>
              </div>
              <h1 className="plain-heading special-font text-[#574A24] text-[3rem] px-4 md:text-[5rem] leading-none md:leading-[5rem] text-start font-light italic">
                End<span className="text-[#80775C]">u</span>ring
                <br />
                Test<span className="text-[#80775C]">a</span>ment
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2">
              <div className="absolute inset-0 bg-[#574A24]/10 mix-blend-multiply z-10"></div>
              <Image
                src={zapoteImageUrl || "/placeholder.svg"}
                alt="Battle of Zapote historical image"
                className="object-cover object-bottom opacity-30 sepia-[0.15]"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Tilt>
        </div>
      </div>

      {/* Decorative battle-themed element at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCAxMDAgNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAsMCBMMTAwLDAgTDk1LDQgTDUsNCBMMCwwIFoiIGZpbGw9IiNDQkJEOTMiIGZpbGwtb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPg==')] bg-repeat-x opacity-50"></div>
      </div>
    </section>
  )
}

export default Zapote
