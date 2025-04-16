"use client"
import { motion } from "framer-motion"
import Shrine from "@/components/aboutpage/aboutshrine/shrine"

const AboutUs = () => {
  const scrollToExplore = () => {
    const exploreSection = document.getElementById("explore")
    exploreSection?.scrollIntoView({ behavior: "smooth" })
  }

  // Variant for "slide in" from the right or left
  const slideIn = {
    hidden: { opacity: 0, x: 60 }, // Start slightly to the right
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  // Subtle fade & lift for headings and paragraphs
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-bl from-[#f5f0e5] to-[#e6d7c3] overflow-hidden">
      {/* Decorative buildings silhouette at the top */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,40 L25,40 L25,20 L35,20 L35,10 L45,10 L45,20 L55,20 L55,40 L75,40 L75,25 L85,25 L85,15 L95,15 L95,25 L105,25 L105,40 L125,40 L125,15 L135,15 L135,5 L145,5 L145,15 L155,15 L155,40 L175,40 L175,20 L185,20 L185,10 L195,10 L195,20 L205,20 L205,40 L225,40 L225,25 L235,25 L235,15 L245,15 L245,25 L255,25 L255,40 L275,40 L275,15 L285,15 L285,5 L295,5 L295,15 L305,15 L305,40 L325,40 L325,20 L335,20 L335,10 L345,10 L345,20 L355,20 L355,40 L375,40 L375,25 L385,25 L385,15 L395,15 L395,25 L405,25 L405,40 L425,40 L425,15 L435,15 L435,5 L445,5 L445,15 L455,15 L455,40 L475,40 L475,20 L485,20 L485,10 L495,10 L495,20 L505,20 L505,40 L525,40 L525,25 L535,25 L535,15 L545,15 L545,25 L555,25 L555,40 L575,40 L575,15 L585,15 L585,5 L595,5 L595,15 L605,15 L605,40 L625,40 L625,20 L635,20 L635,10 L645,10 L645,20 L655,20 L655,40 L675,40 L675,25 L685,25 L685,15 L695,15 L695,25 L705,25 L705,40 L725,40 L725,15 L735,15 L735,5 L745,5 L745,15 L755,15 L755,40 L775,40 L775,20 L785,20 L785,10 L795,10 L795,20 L805,20 L805,40 L825,40 L825,25 L835,25 L835,15 L845,15 L845,25 L855,25 L855,40 L875,40 L875,15 L885,15 L885,5 L895,5 L895,15 L905,15 L905,40 L925,40 L925,20 L935,20 L935,10 L945,10 L945,20 L955,20 L955,40 L975,40 L975,25 L985,25 L985,15 L995,15 L995,25 L1000,25 L1000,40 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="hero-section flex flex-col md:flex-row justify-center items-center min-h-screen text-left space-y-8 md:space-y-0 px-4 sm:px-6"
        variants={slideIn}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 px-6 md:px-16 lg:px-24 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#654321] leading-tight"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            🔍 Unlock Cavite&apos;s Best-Kept Secrets!
          </motion.h1>

          <motion.p
            className="text-md sm:text-lg md:text-xl lg:text-2xl mt-5 text-[#8B4513] leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }} // slightly delay this one
          >
            Welcome to <strong>Cavite Venture</strong>&mdash;your ultimate guide to the hidden wonders of Cavite! 🌿✨ Step
            off the beaten path and uncover
            <strong> historic landmarks, breathtaking attractions, and secret spots</strong> waiting to be explored.
          </motion.p>

          <motion.p
            className="text-md sm:text-lg md:text-xl lg:text-2xl mt-5 text-[#8B4513] leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }} // add a bit more delay
          >
            Whether you&apos;re a <strong>history buff, adventure seeker</strong>, or just curious, we&apos;ll take you on a
            journey through Cavite&apos;s most captivating destinations.
          </motion.p>

          <motion.p
            className="mt-4 text-lg font-semibold text-[#654321]"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            Ready to explore? Let&apos;s go! 🚀
          </motion.p>

          {/* CTA Button - Updated with sand and brown colors */}
          <motion.div
            className="mt-10"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={scrollToExplore}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#654321",
                color: "#f5f0e5",
                boxShadow: "0px 8px 20px rgba(101, 67, 33, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#f5f0e5] text-[#654321] border-2 border-[#8B4513] font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg"
            >
              Explore More
            </motion.button>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 relative">
          {/* Decorative frame around the Shrine component */}
          <motion.div
            className="absolute inset-0 -m-4 border-8 border-[#8B4513]/20 rounded-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Shrine />
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative buildings silhouette at the bottom */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,0 L25,0 L25,20 L35,20 L35,30 L45,30 L45,20 L55,20 L55,0 L75,0 L75,15 L85,15 L85,25 L95,25 L95,15 L105,15 L105,0 L125,0 L125,25 L135,25 L135,35 L145,35 L145,25 L155,25 L155,0 L175,0 L175,15 L185,15 L185,25 L195,25 L195,15 L205,15 L205,0 L225,0 L225,15 L235,15 L235,25 L245,25 L245,15 L255,15 L255,0 L275,0 L275,25 L285,25 L285,35 L295,35 L295,25 L305,25 L305,0 L325,0 L325,15 L335,15 L335,25 L345,25 L345,15 L355,15 L355,0 L375,0 L375,15 L385,15 L385,25 L395,25 L395,15 L405,15 L405,0 L425,0 L425,15 L435,15 L435,25 L445,25 L445,15 L455,15 L455,0 L475,0 L475,15 L485,15 L485,25 L495,25 L495,15 L505,15 L505,0 L525,0 L525,15 L535,15 L535,25 L545,25 L545,15 L555,15 L555,0 L575,0 L575,15 L585,15 L585,25 L595,25 L595,15 L605,15 L605,0 L625,0 L625,15 L635,15 L635,25 L645,25 L645,15 L655,15 L655,0 L675,0 L675,15 L685,15 L685,25 L695,25 L695,15 L705,15 L705,0 L725,0 L725,15 L735,15 L735,25 L745,25 L745,15 L755,15 L755,0 L775,0 L775,15 L785,15 L785,25 L795,25 L795,15 L805,15 L805,0 L825,0 L825,15 L835,15 L835,25 L845,25 L845,15 L855,15 L855,0 L875,0 L875,15 L885,15 L885,25 L895,25 L895,15 L905,15 L905,0 L925,0 L925,15 L935,15 L935,25 L945,25 L945,15 L955,15 L955,0 L975,0 L975,15 L985,15 L985,25 L995,25 L995,15 L1000,15 L1000,0 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
            transform: "rotate(180deg)",
          }}
        ></div>
      </div>
    </div>
  )
}

export default AboutUs
