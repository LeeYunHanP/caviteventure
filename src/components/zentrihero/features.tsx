"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

interface BentoTiltProps {
  children: React.ReactNode
  className?: string
}

export const BentoTilt = ({ children, className = "" }: BentoTiltProps) => {
  const [transformStyle, setTransformStyle] = useState("")
  const itemRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!itemRef.current) return

    const { left, top, width, height } = itemRef.current.getBoundingClientRect()

    const relativeX = (event.clientX - left) / width
    const relativeY = (event.clientY - top) / height

    const tiltX = (relativeY - 0.5) * 5
    const tiltY = (relativeX - 0.5) * -5

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
    setTransformStyle(newTransform)
  }

  const handleMouseLeave = () => {
    setTransformStyle("")
  }

  return (
    <div
      ref={itemRef}
      className={`transition-transform duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  src: string
  title: React.ReactNode
  description?: string
  isComingSoon?: boolean
}

export const BentoCard = ({ src, title, description, isComingSoon }: BentoCardProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [hoverOpacity, setHoverOpacity] = useState(0)
  const hoverButtonRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hoverButtonRef.current) return
    const rect = hoverButtonRef.current.getBoundingClientRect()

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handleMouseEnter = () => setHoverOpacity(1)
  const handleMouseLeave = () => setHoverOpacity(0)

  return (
    <div className="relative size-full overflow-hidden rounded-lg shadow-md">
      <video src={src} loop muted autoPlay className="absolute left-0 top-0 size-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#574A24]/80 via-[#574A24]/30 to-transparent"></div>
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-[#FAE8B4]">
        <div>
          <h1 className="bento-title special-font text-3xl md:text-4xl lg:text-5xl font-light italic">{title}</h1>
          {description && <p className="mt-3 max-w-64 text-xs md:text-base text-[#FAE8B4]/90">{description}</p>}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[#574A24]/80 border border-[#CBBD93]/30 px-5 py-2 text-xs uppercase text-[#FAE8B4]/80 transition-all duration-300 hover:bg-[#574A24] hover:text-[#FAE8B4]"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #CBBD9388, #57492426)`,
              }}
            />
            <ArrowUpRight className="relative z-20 h-4 w-4" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-[#FAE8B4]/10 to-white pb-52 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-[#CBBD93]/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 rounded-full bg-[#CBBD93]/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 md:px-10 relative z-10">
        <div className="px-5 py-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-medium text-lg text-[#574A24] mb-3"
          >
            Explore Cavite&apos;s Heritage
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-lg text-[#80775C] leading-relaxed"
          >
            Immerse yourself in a rich and ever-expanding universe of historical sites and cultural landmarks that
            showcase the vibrant heritage of Cavite province.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <BentoTilt className="relative mb-7 h-96 w-full overflow-hidden rounded-lg border border-[#CBBD93]/20 md:h-[65vh]">
            <BentoCard
              src="videos/feature-1.mp4"
              title={
                <>
                  Hist<span className="text-[#CBBD93]">o</span>rical S<span className="text-[#CBBD93]">i</span>tes
                </>
              }
              description="Discover the pivotal battlegrounds and landmarks that shaped Cavite's rich historical narrative and the Philippine revolution."
              isComingSoon
            />
          </BentoTilt>
        </motion.div>

        <div className="grid h-auto w-full grid-cols-1 md:grid-cols-2 gap-7">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:row-span-2"
          >
            <BentoTilt className="h-full w-full border border-[#CBBD93]/20 rounded-lg overflow-hidden aspect-[3/4] md:aspect-auto">
              <BentoCard
                src="videos/feature-2.mp4"
                title={
                  <>
                    Cult<span className="text-[#CBBD93]">u</span>ral Herit<span className="text-[#CBBD93]">a</span>ge
                  </>
                }
                description="Explore the traditions, artifacts, and cultural practices that have been preserved through generations in Cavite."
                isComingSoon
              />
            </BentoTilt>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BentoTilt className="h-full w-full border border-[#CBBD93]/20 rounded-lg overflow-hidden aspect-square">
              <BentoCard
                src="videos/feature-3.mp4"
                title={
                  <>
                    Arch<span className="text-[#CBBD93]">i</span>tectural M<span className="text-[#CBBD93]">a</span>
                    rvels
                  </>
                }
                description="Witness the stunning colonial structures and historical buildings that tell the story of Cavite's past."
                isComingSoon
              />
            </BentoTilt>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <BentoTilt className="h-full w-full border border-[#CBBD93]/20 rounded-lg overflow-hidden aspect-square">
              <BentoCard
                src="videos/feature-4.mp4"
                title={
                  <>
                    Loc<span className="text-[#CBBD93]">a</span>l Cuisi<span className="text-[#CBBD93]">n</span>e
                  </>
                }
                description="Savor the authentic flavors and culinary traditions that have been passed down through generations in Cavite."
                isComingSoon
              />
            </BentoTilt>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-2"
          >
            <BentoTilt className="h-full w-full border border-[#CBBD93]/20 rounded-lg overflow-hidden aspect-[2/1]">
              <div className="flex size-full flex-col justify-between bg-[#CBBD93]/10 p-5 rounded-lg">
                <h1 className="bento-title special-font max-w-md text-3xl md:text-4xl lg:text-5xl font-light italic text-[#574A24]">
                  M<span className="text-[#80775C]">o</span>re co<span className="text-[#80775C]">m</span>ing s
                  <span className="text-[#80775C]">o</span>on.
                </h1>
                <div className="flex justify-end p-5">
                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <ArrowUpRight className="h-10 w-10 text-[#574A24]" />
                  </motion.div>
                </div>
              </div>
            </BentoTilt>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Features
