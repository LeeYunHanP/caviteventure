"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedTitle from "./animatedtitle"
import Button from "./button"
import { CuboidIcon as Cube3d, Glasses } from "lucide-react"

interface ImageClipBoxProps {
  src: string
  clipClass: string
  alt?: string
}

const ImageClipBox: React.FC<ImageClipBoxProps> = ({ src, clipClass, alt = "" }) => (
  <motion.div
    className={`${clipClass} relative`}
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
  </motion.div>
)

const Contact: React.FC = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-2xl bg-gradient-to-br from-[#FAE8B4] to-[#CBBD93] py-24 text-[#574A24] sm:overflow-hidden shadow-xl border border-[#CBBD93]/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-[#574A24]/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[10%] w-96 h-96 rounded-full bg-[#574A24]/5 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjNTc0QTI0IiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM1NzRBMjQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPgo8L3N2Zz4=')] opacity-30"></div>
        </div>

        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          {/* Decorative vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#574A24]/20 to-transparent"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox src="/img/swordman-partial.webp" clipClass="absolute md:scale-125" alt="Historical figure" />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
            alt="Historical figure silhouette"
          />
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 font-general text-[10px] uppercase tracking-wider text-[#574A24]"
          >
            Experience Cavite&apos;s Heritage
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedTitle
              title="Let&#39;s Expl<span>o</span>re the <br /> Rich Hist<span>o</span>ry of <br /> C<span>a</span>vite T<span>o</span>gether."
              containerClass="text-[#574A24] special-font !md:text-[6.2rem] w-full !text-5xl !font-black !leading-[.9]"
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              id="contact-3d-btn"
              title="3D MUSEUM"
              containerClass="bg-[#574A24] hover:bg-[#80775C] text-[#FAE8B4] font-medium px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md cursor-pointer"
              leftIcon={<Cube3d className="h-5 w-5" />}
              rightIcon={null}
            />
            <Button
              id="contact-vr-btn"
              title="VIRTUAL REALITY"
              containerClass="bg-[#CBBD93]/80 hover:bg-[#CBBD93] text-[#574A24] font-medium px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md cursor-pointer border border-[#574A24]/10"
              leftIcon={<Glasses className="h-5 w-5" />}
              rightIcon={null}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
