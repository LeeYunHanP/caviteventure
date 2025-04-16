/* ------------------------------------------------------------------
   src/components/topheader/header.tsx
   ------------------------------------------------------------------
   – ESLint‑clean: no‑unused‑vars, no‑unused‑expressions
   – Uses Cloudinary logo
   – Re‑uses <Brand> helper to avoid repetition
   – Every onClick handler now has an explicit block (no bare ternary)
------------------------------------------------------------------- */

"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR from "swr"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Icons (client‑only, avoids SSR warnings)
const MenuIcon  = dynamic(() => import("lucide-react").then(m => m.Menu), { ssr: false })
const CloseIcon = dynamic(() => import("lucide-react").then(m => m.X),    { ssr: false })

/** Cloudinary logo */
const LOGO_URL =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744546258/icon_amqjvg.jpg"

/** SWR fetcher */
const fetcher = (url: string) => fetch(url).then(res => res.json())

/* =========================================================================
 *  Header component
 * ========================================================================= */
export default function Header() {
  const router = useRouter()

  /* ---------- auth state (poll every 5 s) ---------- */
  const { data } = useSWR("/api/auth/me", fetcher, { refreshInterval: 5000 })
  const isAuthenticated = data?.isAuthenticated ?? false
  const userRole: string | undefined = data?.user?.role // "superadmin" | "admin" | "user"

  /* ---------- UI state ---------- */
  const [isMenuOpen,   setIsMenuOpen]   = useState(false)
  const [isPromptOpen, setIsPromptOpen] = useState(false) // sign‑in modal

  /* ---------- close mobile menu on ≥ md ---------- */
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  /* ---------- small reusable brand ---------- */
  const Brand = ({ href }: { href: string }) => (
    <Link href={href} className="flex items-center gap-2 group">
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(101,67,33,0.15)] group-hover:shadow-[0_6px_16px_rgba(101,67,33,0.25)]">
        <Image
          src={LOGO_URL}
          alt="CaviteVenture Logo"
          width={40}
          height={40}
          className="rounded-lg border border-[#d7c3a7] transition-transform duration-500 group-hover:scale-110"
          priority
        />
      </div>
      <span className="text-lg font-bold text-[#654321] drop-shadow-sm transition-all duration-300 group-hover:text-[#8B4513]">
        CaviteVenture
      </span>
    </Link>
  )

  /* =========================================================================
   *  PUBLIC NAVBAR (unauthenticated)
   * ========================================================================= */
  const PublicNav = (
    <>
      {/* ---------- Sign‑in modal ---------- */}
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-b from-[#f5f0e5] to-[#e6d7c3] p-8 rounded-xl shadow-[0_10px_40px_-5px_rgba(101,67,33,0.3),0_0_20px_-5px_rgba(101,67,33,0.2)] border border-[#d7c3a7] w-full max-w-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#654321] via-[#8B4513] to-[#654321]" />

              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mb-4 bg-[#654321]/10 w-16 h-16 rounded-full flex items-center justify-center shadow-inner"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#654321]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#654321] font-bold text-xl mb-2"
                >
                  Sign in Required
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#8B4513]"
                >
                  Please sign in to your account to view and register for our exclusive events and exhibitions.
                </motion.p>
              </div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col gap-3">
                <motion.button
                  onClick={() => {
                    setIsPromptOpen(false)
                    router.push("/signin")
                  }}
                  className="bg-[#654321] text-[#f5f0e5] px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ backgroundColor: "#8B4513", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>

                  <motion.button
                    onClick={() => router.push("/signup")}
                    className="border border-[#654321] text-[#654321] px-4 py-3 rounded-lg font-medium"
                    whileHover={{ backgroundColor: "rgba(101,67,33,0.1)", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create an Account
                  </motion.button>
              </motion.div>

              <motion.button
                onClick={() => setIsPromptOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute top-4 right-4 text-[#654321] bg-[#f5f0e5] rounded-full p-1.5"
                aria-label="Close dialog"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Public header ---------- */}
      <header className="sticky top-0 z-40 bg-[#f5f0e5]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(101,67,33,0.15)] border-b border-[#d7c3a7]">
        <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
          <Brand href="/" />

          {/* Hamburger */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#654321] hover:bg-[#d7c3a7]/20 rounded-md relative z-50 overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={false}
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </motion.button>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-[#654321]/80 items-center">
            {["Home", "About", "Events"].map(link => (
              <motion.button
                key={link}
                onClick={() => {
                  if (link === "Events") {
                    setIsPromptOpen(true)
                  } else {
                    router.push(link === "Home" ? "/" : `/${link.toLowerCase()}`)
                  }
                }}
                className="font-bold uppercase hover:text-[#8B4513] relative group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B4513] group-hover:w-full transition-all" />
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#654321]/5 backdrop-blur-sm md:hidden z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.nav
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                }}
                className="md:hidden bg-[#f5f0e5] border-t border-[#d7c3a7] shadow-[0_10px_15px_-3px_rgba(101,67,33,0.1)] relative z-40"
              >
                <ul className="flex flex-col gap-4 p-4 text-[#654321]/80">
                  {["Home", "About", "Events"].map((link, i) => (
                    <motion.li
                      key={link}
                      custom={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="pl-2 border-l-2 border-transparent hover:border-[#8B4513]"
                      onClick={() => {
                        setIsMenuOpen(false)
                        if (link === "Events") {
                          setIsPromptOpen(true)
                        } else {
                          router.push(link === "Home" ? "/" : `/${link.toLowerCase()}`)
                        }
                      }}
                    >
                      {link}
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )

  /* =========================================================================
   *  PRIVATE NAVBAR generators
   * ========================================================================= */
  const PrivateNav = (role: "superadmin" | "admin" | "user") => {
    const config = {
      superadmin: {
        href: "/superadmindashboard",
        items: [
          { name: "Dashboard", href: "/superadmindashboard" },
          { name: "Event Approval", href: "/eventapproval" },
          { name: "Profile", href: "/profilepage" },
        ],
      },
      admin: {
        href: "/dashboard",
        items: [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Create Event", href: "/createevent" },
          { name: "Profile", href: "/profilepage" },
        ],
      },
      user: {
        href: "/homepage",
        items: [
          { name: "Home", href: "/homepage" },
          { name: "Events", href: "/eventpage" },
          { name: "Exhibit", href: "/exhibitpage" },
          { name: "Profile", href: "/profilepage" },
        ],
      },
    }[role]

    return (
      <header className="sticky top-0 z-40 bg-[#f5f0e5]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(101,67,33,0.15)] border-b border-[#d7c3a7]">
        <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
          <Brand href={config.href} />

          {/* Hamburger */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#654321] hover:bg-[#d7c3a7]/20 rounded-md relative z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={false}
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </motion.button>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-[#654321]/80 items-center">
            {config.items.map(item => (
              <motion.div key={item.name} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href={item.href} className="font-bold uppercase hover:text-[#8B4513]">
                  {item.name}
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B4513] group-hover:w-full transition-all" />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#654321]/5 backdrop-blur-sm md:hidden z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.nav
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                }}
                className="md:hidden bg-[#f5f0e5] border-t border-[#d7c3a7] shadow-[0_10px_15px_-3px_rgba(101,67,33,0.1)] relative z-40"
              >
                <ul className="flex flex-col gap-4 p-4 text-[#654321]/80">
                  {config.items.map((item, i) => (
                    <motion.li
                      key={item.name}
                      custom={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="pl-2 border-l-2 border-transparent hover:border-[#8B4513]"
                      onClick={() => {
                        setIsMenuOpen(false)
                        router.push(item.href)
                      }}
                    >
                      {item.name}
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    )
  }

  /* =========================================================================
   *  FINAL RENDER
   * ========================================================================= */
  return (
    <>
      {!isAuthenticated && PublicNav}
      {isAuthenticated && userRole === "superadmin" && PrivateNav("superadmin")}
      {isAuthenticated && userRole === "admin" && PrivateNav("admin")}
      {isAuthenticated && isAuthenticated && userRole !== "admin" && userRole !== "superadmin" && PrivateNav("user")}
    </>
  )
}
