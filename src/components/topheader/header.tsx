"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR from "swr"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Dynamically import Lucide icons for no SSR usage
const MenuIcon = dynamic(() => import("lucide-react").then((mod) => mod.Menu), {
  ssr: false,
})
const CloseIcon = dynamic(() => import("lucide-react").then((mod) => mod.X), {
  ssr: false,
})

// Updated Asset: Use Cloudinary for optimized image delivery
// "f_auto" selects the best image format and "q_auto" adjusts quality automatically.
const cloudinaryLogo =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/f_auto,q_auto/v1744546258/icon_amqjvg.jpg"

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Header() {
  const router = useRouter()

  // Use SWR to fetch auth status and user role in real time (poll every 5 seconds)
  const { data } = useSWR("/api/auth/me", fetcher, {
    refreshInterval: 5000,
  })
  const isAuthenticated = data?.isAuthenticated || false
  const userRole = data?.user?.role // e.g. "admin", "superadmin", or "user"

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPromptOpen, setIsPromptOpen] = useState(false)

  // For mobile responsiveness: close the menu if the window is resized to desktop
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) {
      setIsMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return (
    <>
      {/* ----------------------- PUBLIC NAVBAR ----------------------- */}
      {!isAuthenticated && (
        <>
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
                  className="bg-gradient-to-b from-[#FAE8B4] to-[#CBBD93] p-8 rounded-xl shadow-[0_10px_40px_-5px_rgba(101,67,33,0.3),0_0_20px_-5px_rgba(101,67,33,0.2)] border border-[#CBBD93] w-full max-w-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#574A24] via-[#80775C] to-[#574A24]" />

                  <div className="mb-6 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mx-auto mb-4 bg-[#574A24]/10 w-16 h-16 rounded-full flex items-center justify-center shadow-inner"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#574A24] drop-shadow-md"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </motion.div>
                    <motion.h3
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[#574A24] font-bold text-xl mb-2 drop-shadow-sm"
                    >
                      Sign in Required
                    </motion.h3>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[#80775C] leading-relaxed"
                    >
                      Please sign in to your account to view and register for our exclusive events and exhibitions.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-3"
                  >
                    <motion.button
                      onClick={() => {
                        setIsPromptOpen(false)
                        router.push("/signin")
                      }}
                      className="bg-[#574A24] text-[#FAE8B4] px-4 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(101,67,33,0.3)]"
                      whileHover={{
                        backgroundColor: "#80775C",
                        scale: 1.02,
                        boxShadow: "0 10px 15px -3px rgba(101,67,33,0.2), 0 4px 6px -2px rgba(101,67,33,0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </motion.button>

                    <motion.button
                      onClick={() => router.push("/signup")}
                      className="bg-transparent border border-[#574A24] text-[#574A24] px-4 py-3 rounded-lg transition-all duration-300 font-medium shadow-sm"
                      whileHover={{
                        backgroundColor: "rgba(87,74,36,0.1)",
                        scale: 1.02,
                        boxShadow: "0 4px 8px -2px rgba(101,67,33,0.15)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create an Account
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#8B4513]/10 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />

                  <motion.button
                    onClick={() => setIsPromptOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="absolute top-4 right-4 text-[#574A24] hover:text-[#80775C] bg-[#FAE8B4] rounded-full p-1.5 shadow-md"
                    aria-label="Close dialog"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <header className="sticky top-0 z-40 bg-[#FAE8B4]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(87,74,36,0.15)] border-b border-[#CBBD93]">
            <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(101,67,33,0.15)] group-hover:shadow-[0_6px_16px_rgba(101,67,33,0.25)]">
                  <Image
                    src={cloudinaryLogo}
                    alt="CaviteVenture Logo"
                    width={40}
                    height={40}
                    className="rounded-lg border border-[#CBBD93] transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
                <span className="text-lg font-bold text-[#574A24] drop-shadow-sm transition-all duration-300 group-hover:text-[#80775C]">
                  CaviteVenture
                </span>
              </Link>

              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-[#574A24] hover:bg-[#CBBD93]/20 rounded-md shadow-sm relative z-50 overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={{
                  rotate: isMenuOpen ? 90 : 0,
                  backgroundColor: isMenuOpen
                    ? "rgba(215,195,167,0.3)"
                    : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: isMenuOpen ? 0 : 1, y: isMenuOpen ? -20 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MenuIcon className="h-6 w-6" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CloseIcon className="h-6 w-6" />
                </motion.div>
              </motion.button>

              <nav className="hidden md:flex gap-6 text-[#574A24]/80 items-center">
                {[
                  "Home", "About", "Events",
                ].map((link) => (
                  <motion.button
                    key={link}
                    onClick={() =>
                      link === "Events"
                        ? setIsPromptOpen(true)
                        : router.push(link === "Home" ? "/" : `/${link.toLowerCase()}`)
                    }
                    className="font-bold uppercase hover:text-[#80775C] transition relative group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-[#574A24]/5 backdrop-blur-sm md:hidden z-40"
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
                    className="md:hidden bg-[#FAE8B4] border-t border-[#CBBD93] shadow-[0_10px_15px_-3px_rgba(87,74,36,0.1)] relative z-40 overflow-hidden"
                  >
                    <ul className="flex flex-col gap-4 p-4 text-[#574A24]/80">
                      {[
                        { name: "Home", href: "/homepage" },
                        { name: "Events", href: "/eventpage" },
                        { name: "Exhibit", href: "/exhibitpage" },
                        { name: "Profile", href: "/profilepage" },
                      ].map((item, index) => (
                        <motion.li
                          key={item.name}
                          custom={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: "easeOut",
                          }}
                          className="pl-2 border-l-2 border-transparent hover:border-[#80775C] hover:shadow-sm relative overflow-hidden"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block font-bold uppercase transition"
                          >
                            <motion.span
                              initial={{ y: 0 }}
                              whileHover={{ y: -20 }}
                              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                              className="block"
                            >
                              {item.name}
                            </motion.span>
                            <motion.span
                              initial={{ y: 20 }}
                              whileHover={{ y: 0 }}
                              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                              className="absolute left-2 text-[#80775C]"
                            >
                              {item.name}
                            </motion.span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.nav>
                </>
              )}
            </AnimatePresence>
          </header>
        </>
      )}

      {/* ----------------------- PRIVATE NAVBAR: SUPERADMIN ----------------------- */}
      {isAuthenticated && userRole === "superadmin" && (
        <header className="sticky top-0 z-40 bg-[#FAE8B4]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(87,74,36,0.15)] border-b border-[#CBBD93]">
          <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
            <Link href="/superadmindashboard" className="flex items-center gap-2 group">
              <div className="relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(101,67,33,0.15)] group-hover:shadow-[0_6px_16px_rgba(101,67,33,0.25)]">
                <Image
                  src={cloudinaryLogo}
                  alt="CaviteVenture Logo"
                  width={40}
                  height={40}
                  className="rounded-lg border border-[#CBBD93] transition-transform duration-500 group-hover:scale-110"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-[#574A24] drop-shadow-sm transition-all duration-300 group-hover:text-[#80775C]">
                CaviteVenture
              </span>
            </Link>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#574A24] hover:bg-[#CBBD93]/20 rounded-md shadow-sm relative z-50 overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                rotate: isMenuOpen ? 90 : 0,
                backgroundColor: isMenuOpen ? "rgba(215,195,167,0.3)" : "rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 0 : 1, y: isMenuOpen ? -20 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <MenuIcon className="h-6 w-6" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CloseIcon className="h-6 w-6" />
              </motion.div>
            </motion.button>

            <nav className="hidden md:flex gap-6 text-[#574A24]/80 items-center">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/superadmindashboard" className="font-bold uppercase hover:text-[#80775C] transition">
                  Dashboard
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/eventapproval" className="font-bold uppercase hover:text-[#80775C] transition">
                  Event Approval
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              {/* SUPERADMIN uses the same /profilepage route as others */}
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/profilepage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Profile
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
            </nav>
          </div>

          {/* Mobile menu for superadmin */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-[#574A24]/5 backdrop-blur-sm md:hidden z-40"
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
                  className="md:hidden bg-[#FAE8B4] border-t border-[#CBBD93] shadow-[0_10px_15px_-3px_rgba(87,74,36,0.1)] relative z-40 overflow-hidden"
                >
                  <ul className="flex flex-col gap-4 p-4 text-[#574A24]/80">
                    {[
                      { name: "Dashboard", href: "/dashboard" },
                      { name: "Create Event", href: "/createevent" },
                      { name: "Profile", href: "/profilepage" },
                    ].map((item, index) => (
                      <motion.li
                        key={item.name}
                        custom={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="pl-2 border-l-2 border-transparent hover:border-[#80775C] hover:shadow-sm relative overflow-hidden"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-bold uppercase transition"
                        >
                          <motion.span
                            initial={{ y: 0 }}
                            whileHover={{ y: -20 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="block"
                          >
                            {item.name}
                          </motion.span>
                          <motion.span
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="absolute left-2 text-[#80775C]"
                          >
                            {item.name}
                          </motion.span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* ----------------------- PRIVATE NAVBAR: ADMIN ----------------------- */}
      {isAuthenticated && userRole === "admin" && (
        <header className="sticky top-0 z-40 bg-[#FAE8B4]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(87,74,36,0.15)] border-b border-[#CBBD93]">
          <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(101,67,33,0.15)] group-hover:shadow-[0_6px_16px_rgba(101,67,33,0.25)]">
                <Image
                  src={cloudinaryLogo}
                  alt="CaviteVenture Logo"
                  width={40}
                  height={40}
                  className="rounded-lg border border-[#CBBD93] transition-transform duration-500 group-hover:scale-110"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-[#574A24] drop-shadow-sm transition-all duration-300 group-hover:text-[#80775C]">
                CaviteVenture
              </span>
            </Link>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#574A24] hover:bg-[#CBBD93]/20 rounded-md shadow-sm relative z-50 overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                rotate: isMenuOpen ? 90 : 0,
                backgroundColor: isMenuOpen ? "rgba(215,195,167,0.3)" : "rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 0 : 1, y: isMenuOpen ? -20 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <MenuIcon className="h-6 w-6" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CloseIcon className="h-6 w-6" />
              </motion.div>
            </motion.button>

            <nav className="hidden md:flex gap-6 text-[#574A24]/80 items-center">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/dashboard" className="font-bold uppercase hover:text-[#80775C] transition">
                  Dashboard
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/createevent" className="font-bold uppercase hover:text-[#80775C] transition">
                  Create Event
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/profilepage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Profile
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
            </nav>
          </div>

          {/* Mobile menu for admin */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-[#574A24]/5 backdrop-blur-sm md:hidden z-40"
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
                  className="md:hidden bg-[#FAE8B4] border-t border-[#CBBD93] shadow-[0_10px_15px_-3px_rgba(87,74,36,0.1)] relative z-40 overflow-hidden"
                >
                  <ul className="flex flex-col gap-4 p-4 text-[#574A24]/80">
                    {[
                      { name: "Home", href: "/homepage" },
                      { name: "Events", href: "/eventpage" },
                      { name: "Exhibit", href: "/exhibitpage" },
                      { name: "Profile", href: "/profilepage" },
                    ].map((item, index) => (
                      <motion.li
                        key={item.name}
                        custom={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="pl-2 border-l-2 border-transparent hover:border-[#80775C] hover:shadow-sm relative overflow-hidden"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-bold uppercase transition"
                        >
                          <motion.span
                            initial={{ y: 0 }}
                            whileHover={{ y: -20 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="block"
                          >
                            {item.name}
                          </motion.span>
                          <motion.span
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="absolute left-2 text-[#80775C]"
                          >
                            {item.name}
                          </motion.span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* ----------------------- PRIVATE NAVBAR: REGULAR USER ----------------------- */}
      {isAuthenticated && userRole !== "admin" && userRole !== "superadmin" && (
        <header className="sticky top-0 z-40 bg-[#FAE8B4]/80 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(87,74,36,0.15)] border-b border-[#CBBD93]">
          <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
            <Link href="/homepage" className="flex items-center gap-2 group">
              <div className="relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(101,67,33,0.15)] group-hover:shadow-[0_6px_16px_rgba(101,67,33,0.25)]">
                <Image
                  src={cloudinaryLogo}
                  alt="CaviteVenture Logo"
                  width={40}
                  height={40}
                  className="rounded-lg border border-[#CBBD93] transition-transform duration-500 group-hover:scale-110"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-[#574A24] drop-shadow-sm transition-all duration-300 group-hover:text-[#80775C]">
                CaviteVenture
              </span>
            </Link>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#574A24] hover:bg-[#CBBD93]/20 rounded-md shadow-sm relative z-50 overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                rotate: isMenuOpen ? 90 : 0,
                backgroundColor: isMenuOpen ? "rgba(215,195,167,0.3)" : "rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 0 : 1, y: isMenuOpen ? -20 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <MenuIcon className="h-6 w-6" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CloseIcon className="h-6 w-6" />
              </motion.div>
            </motion.button>

            <nav className="hidden md:flex gap-6 text-[#574A24]/80 items-center">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/homepage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Home
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/eventpage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Events
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/exhibitpage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Exhibit
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                <Link href="/profilepage" className="font-bold uppercase hover:text-[#80775C] transition">
                  Profile
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#80775C] transition-all duration-300 group-hover:w-full shadow-sm"></span>
              </motion.div>
            </nav>
          </div>

          {/* Mobile menu for regular user */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-[#574A24]/5 backdrop-blur-sm md:hidden z-40"
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
                  className="md:hidden bg-[#FAE8B4] border-t border-[#CBBD93] shadow-[0_10px_15px_-3px_rgba(87,74,36,0.1)] relative z-40 overflow-hidden"
                >
                  <ul className="flex flex-col gap-4 p-4 text-[#574A24]/80">
                    {[
                      { name: "Home", href: "/homepage" },
                      { name: "Events", href: "/eventpage" },
                      { name: "Exhibit", href: "/exhibitpage" },
                      { name: "Profile", href: "/profilepage" },
                    ].map((item, index) => (
                      <motion.li
                        key={item.name}
                        custom={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="pl-2 border-l-2 border-transparent hover:border-[#80775C] hover:shadow-sm relative overflow-hidden"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-bold uppercase transition"
                        >
                          <motion.span
                            initial={{ y: 0 }}
                            whileHover={{ y: -20 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="block"
                          >
                            {item.name}
                          </motion.span>
                          <motion.span
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                            className="absolute left-2 text-[#80775C]"
                          >
                            {item.name}
                          </motion.span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </header>
      )}
    </>
  )
}
