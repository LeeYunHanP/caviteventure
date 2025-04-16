"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// New Cloudinary image URLs
const bannerImage =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808991/DSC_0018_1_nw0qsz.jpg";
const galleryImage1 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808992/DSC_0018_4_w8bfua.jpg";
const galleryImage2 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808991/DSC_0018_3_qoel65.jpg";
const galleryImage3 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808993/DSC_0018_6_bcmxy7.jpg";
const galleryImage4 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808992/DSC_0018_5_wtcrpj.jpg";
const galleryImage5 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808999/Ram%C3%B3n_Blanco_pyq5yc.png";
const galleryImage6 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808999/firstpresidnent_zxgtiv.jpg";

// Framer Motion variants for staggering animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const BinakayanPage = () => {
  return (
    <div className="bg-[#f5f0e5]">
      {/* Banner Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={bannerImage}
          alt="Binakayan Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#654321]/70 to-[#654321]/40 flex items-center justify-center">
          <motion.h1
            className="text-5xl md:text-7xl text-[#f5f0e5] font-bold drop-shadow-lg px-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Battle of Binakayan
          </motion.h1>
        </div>

        {/* Decorative buildings silhouette at the bottom of banner */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden">
          <div
            className="w-full h-full bg-repeat-x"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23f5f0e5'%3E%3Cpath d='M0,40 L25,40 L25,20 L35,20 L35,10 L45,10 L45,20 L55,20 L55,40 L75,40 L75,25 L85,25 L85,15 L95,15 L95,25 L105,25 L105,40 L125,40 L125,15 L135,15 L135,5 L145,5 L145,15 L155,15 L155,40 L175,40 L175,20 L185,20 L185,10 L195,10 L195,20 L205,20 L205,40 L225,40 L225,25 L235,25 L235,15 L245,15 L245,25 L255,25 L255,40 L275,40 L275,15 L285,15 L285,5 L295,5 L295,15 L305,15 L305,40 L325,40 L325,20 L335,20 L335,10 L345,10 L345,20 L355,20 L355,40 L375,40 L375,25 L385,25 L385,15 L395,15 L395,25 L405,25 L405,40 L425,40 L425,15 L435,15 L435,5 L445,5 L445,15 L455,15 L455,40 L475,40 L475,20 L485,20 L485,10 L495,10 L495,20 L505,20 L505,40 L525,40 L525,25 L535,25 L535,15 L545,15 L545,25 L555,25 L555,40 L575,40 L575,15 L585,15 L585,5 L595,5 L595,15 L605,15 L605,40 L625,40 L625,20 L635,20 L635,10 L645,10 L645,20 L655,20 L655,40 L675,40 L675,25 L685,25 L685,15 L695,15 L695,25 L705,25 L705,40 L725,40 L725,15 L735,15 L735,5 L745,5 L745,15 L755,15 L755,40 L775,40 L775,20 L785,20 L785,10 L795,10 L795,20 L805,20 L805,40 L825,40 L825,25 L835,25 L835,15 L845,15 L845,25 L855,25 L855,40 L875,40 L875,15 L885,15 L885,5 L895,5 L895,15 L905,15 L905,40 L925,40 L925,20 L935,20 L935,10 L945,10 L945,20 L955,20 L955,40 L975,40 L975,25 L985,25 L985,15 L995,15 L995,25 L1000,25 L1000,40 Z'/%3E%3C/svg%3E")`,
              backgroundSize: "1000px 40px",
              opacity: 0.6,
            }}
          ></div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto py-12 px-4 relative">
        {/* Decorative vertical line */}
        <div className="absolute left-1/4 top-32 bottom-12 w-1 hidden md:block bg-gradient-to-b from-[#8B4513] to-[#e6d7c3]"></div>

        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-[#3E2723]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Timeline of the Battle of Binakayan
        </motion.h2>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Pre-battle context */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">Pre-Battle</span>
              {/* Timeline dot */}
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#e6d7c3]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                In the months leading to the revolution, tensions between Filipino revolutionaries and Spanish colonial
                authorities escalated. The Binakayan region in Cavite became a focal point for revolutionary activities
                following the formation of the Katipunan.
              </p>
            </div>
          </motion.div>

          {/* Battle begins */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">November 9, 1896</span>
              {/* Timeline dot */}
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#e6d7c3]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                The battle commences as Filipino forces launch a coordinated offensive against Spanish troops in
                Binakayan. This marked one of the first major engagements of the revolution.
              </p>
            </div>
          </motion.div>

          {/* Battle intensifies */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">November 10, 1896</span>
              {/* Timeline dot */}
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#e6d7c3]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                Intense fighting takes place on November 10. Utilizing guerrilla tactics and the local terrain, the
                Filipino revolutionaries engage Spanish forces in a series of decisive clashes.
              </p>
            </div>
          </motion.div>

          {/* Battle concludes */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">November 11, 1896</span>
              {/* Timeline dot */}
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#e6d7c3]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                The battle concludes with a decisive victory for the Filipino forces. This victory not only undermined
                Spanish control in Cavite but also ignited further revolutionary fervor across the nation.
              </p>
            </div>
          </motion.div>

          {/* Aftermath */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">Aftermath</span>
              {/* Timeline dot */}
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2\"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#e6d7c3]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                The success at Binakayan boosted the morale of the revolutionaries and set the stage for subsequent
                victories during the Philippine Revolution. Today, the battle is remembered as a testament to Filipino
                resilience and ingenuity.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#3E2723]">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[bannerImage, galleryImage1, galleryImage2, galleryImage3, galleryImage4, galleryImage5, galleryImage6].map(
            (src, idx) => (
              <div key={idx} className="relative h-80">
                <Image
                  src={src}
                  alt={`Battle scene ${idx + 1}`}
                  fill
                  className="object-cover rounded-lg shadow-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Additional Information & References (omitted for brevity) */}

      {/* Decorative buildings silhouette at the bottom */}
      <div className="relative w-full h-12 overflow-hidden">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,40 L25,40 … Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default BinakayanPage;
