"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SignInForm from "@/components/signinforms/signin"
import Link from "next/link"
import { Home, ArrowRight } from "lucide-react"

// FloatingPaths renders the animated SVG paths in the background.
function FloatingPaths({ position, color }: { position: number; color: string }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    opacity: 0.05 + i * 0.01,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className={`w-full h-full ${color}`} viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.4, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// BackgroundPaths renders the animated background along with an animated title.
function BackgroundPaths({ title = "Welcome" }: { title?: string }) {
  const words = title.split(" ")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <FloatingPaths position={1} color="text-[#8d6e63]" />
      <FloatingPaths position={-1} color="text-[#a1887f]" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center mt-8 sm:mt-12 md:mt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter ${isMobile ? "mt-8" : "mt-16"}`}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                    }}
                    className="inline-block text-transparent bg-clip-text 
                               bg-gradient-to-r from-[#5d4037] to-[#8d6e63]"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[#8d6e63] max-w-xl mx-auto text-lg mb-8"
          >
            Sign in to your account to continue your journey.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-[#f8f5f0]">
      {/* Home button */}
      <motion.div
        className="absolute top-4 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm text-[#5d4037] hover:bg-white transition-colors duration-200 shadow-sm"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
      </motion.div>

      {/* Sign up button */}
      <motion.div
        className="absolute top-4 right-4 z-30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/signup"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8d6e63] text-white hover:bg-[#5d4037] transition-colors duration-200 shadow-sm"
        >
          <span>Create Account</span>
          <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Background Animation */}
      <BackgroundPaths title="Welcome" />

      {/* Foreground SignIn Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen p-4 z-20">
        <div className="w-full max-w-md mt-32 sm:mt-40 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <SignInForm />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

