"use client"

import { type FC, useState, useRef, useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

import VideoPreview from "./videopreview"

gsap.registerPlugin(ScrollTrigger)

const totalVideos = 4

const Hero: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [hasClicked, setHasClicked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadedVideos, setLoadedVideos] = useState(0)

  const nextVdRef = useRef<HTMLVideoElement>(null)

  // count loaded videos, hide loader when all but one are ready
  const handleVideoLoad = () => {
    setLoadedVideos((c) => c + 1)
  }

  useEffect(() => {
    if (loadedVideos >= totalVideos - 1) {
      setLoading(false)
    }
  }, [loadedVideos])

  const handleMiniVdClick = () => {
    setHasClicked(true)
    setCurrentIndex((i) => (i % totalVideos) + 1)
  }

  // click‑to‑expand animations
  useEffect(() => {
    if (!hasClicked) return
    const ctx = gsap.context(() => {
      gsap.set("#next-video", { visibility: "visible" })
      gsap.to("#next-video", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => void nextVdRef.current?.play(),
      })
      gsap.from("#current-video", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      })
    })
    return () => ctx.revert()
  }, [hasClicked, currentIndex])

  // scroll‑driven clipPath animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      })
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  const getVideoSrc = (i: number) => `videos/hero-${i}.mp4`

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* loader */}
      {loading && (
        <div className="flex items-center justify-center absolute z-[100] h-dvh w-screen bg-[#FAE8B4]">
          <div className="three-body">
            <div className="three-body__dot bg-[#574A24]"></div>
            <div className="three-body__dot bg-[#574A24]"></div>
            <div className="three-body__dot bg-[#574A24]"></div>
          </div>
        </div>
      )}

      {/* framed section */}
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-[#574A24]/10">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#574A24]/20 via-transparent to-[#574A24]/40 z-10 pointer-events-none"></div>

        {/* preview trigger */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <VideoPreview>
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 pointer-events-auto"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center rounded-lg shadow-lg"
                  onLoadedData={handleVideoLoad}
                />
                <div className="absolute inset-0 bg-[#574A24]/10 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#FAE8B4]/80 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#574A24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </VideoPreview>
        </div>

        {/* next expanded video */}
        <video
          ref={nextVdRef}
          src={getVideoSrc(currentIndex)}
          loop
          muted
          id="next-video"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible z-20 size-64 object-cover object-center"
          onLoadedData={handleVideoLoad}
        />

        {/* background loop */}
        <video
          src={getVideoSrc(currentIndex === totalVideos ? 1 : currentIndex + 1)}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={handleVideoLoad}
        />

        {/* overlay text */}
        <h1 className="special-font hero-heading absolute bottom-10 right-10 z-40 text-[#FAE8B4] text-6xl md:text-8xl font-light italic drop-shadow-md">
          EXP<span className="text-[#CBBD93]">LO</span>RING
        </h1>
        <div className="absolute inset-0 z-40 flex flex-col justify-center px-5 sm:px-10 pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="special-font hero-heading text-[#FAE8B4] mb-4 text-5xl md:text-7xl font-light italic drop-shadow-md"
          >
            redefi<span className="text-[#CBBD93]">n</span>e
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-5 max-w-64 text-[#FAE8B4] text-lg md:text-xl leading-relaxed drop-shadow-md"
          >
            Enter the Heritage Experience <br /> Unleash Cavite&apos;s Rich History
          </motion.p>

          {/* Watch trailer button removed as requested */}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#574A24]/30 to-transparent z-30 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#574A24]/30 to-transparent z-30 pointer-events-none"></div>
      </div>
    </div>
  )
}

export default Hero
