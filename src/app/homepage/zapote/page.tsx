"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";


// New Cloudinary image URLs
const image1 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810660/1200px-Zapote_Bridge_looking_northward_i9oop0.jpg";
const image2 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810659/32fe712f487cb517c825ef3de860c279_xkjs3a.jpg";
const image3 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810661/Battle_of_Zapote_Bridge_1897_kyrpxg.jpg";
const image4 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810678/June-12-2019-121st-Anniversary-of-the-Proclamation-of-Philippine-Independence-at-the-Batt-3_yhcv4y.jpg";
const image5 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810681/Zapote_River_Bridge_in_1899_vje6ht.jpg";
const image6 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810679/painting2_cx86yb.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
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

const ZapotePage = () => {
  return (
    <div className="bg-[#f5f0e5]">
      {/* Banner using the painting image */}
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={image6 || "/placeholder.svg"}
          alt="Zapote Bridge Painting"
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
            Zapote Bridge – A Masterpiece in History
          </motion.h1>
        </div>
        {/* Decorative silhouette at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden">
          <div
            className="w-full h-full bg-repeat-x"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23f5f0e5'%3E%3Cpath d='M0,0 L25,0 L25,20 L35,20 L35,10 L45,10 L45,20 L55,20 L55,0 L75,0 L75,15 L85,15 L85,25 L95,25 L95,15 L105,15 L105,0 L125,0 L125,25 L135,25 L135,35 L145,35 L145,25 L155,25 L155,0 L175,0 L175,20 L185,20 L185,10 L195,10 L195,20 L205,20 L205,0 L225,0 L225,15 L235,15 L235,25 L245,25 L245,15 L255,15 L255,0 L275,0 L275,25 L285,25 L285,35 L295,35 L295,25 L305,25 L305,0 L325,0 L325,20 L335,20 L335,10 L345,10 L345,20 L355,20 L355,0 L375,0 L375,15 L385,15 L385,25 L395,25 L395,15 L405,15 L405,0 L425,0 L425,25 L435,25 L435,35 L445,35 L445,25 L455,25 L455,0 L475,0 L475,20 L485,20 L485,10 L495,10 L495,20 L505,20 L505,0 L525,0 L525,15 L535,15 L535,25 L545,25 L545,15 L555,15 L555,0 L575,0 L575,25 L585,25 L585,35 L595,35 L595,25 L605,25 L605,0 L625,0 L625,20 L635,20 L635,10 L645,10 L645,20 L655,20 L655,40 L675,40 L675,25 L685,25 L685,15 L695,15 L695,25 L705,25 L705,40 L725,40 L725,15 L735,15 L735,5 L745,5 L745,15 L755,15 L755,40 L775,40 L775,20 L785,20 L785,10 L795,10 L795,20 L805,20 L805,0 L825,0 L825,15 L835,15 L835,25 L845,25 L845,15 L855,15 L855,0 L875,0 L875,25 L885,25 L885,35 L895,35 L895,25 L905,25 L905,0 L925,0 L925,20 L935,20 L935,10 L945,10 L945,20 L955,20 L955,40 L975,40 L975,25 L985,25 L985,15 L995,15 L995,25 L1000,25 L1000,40 Z'/%3E%3C/svg%3E")`,
              backgroundSize: "1000px 40px",
              opacity: 0.6,
            }}
          ></div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto py-12 px-4 relative">
        {/* Decorative vertical line */}
        <div className="absolute left-1/4 top-32 bottom-12 w-1 bg-gradient-to-b from-[#3E2723] to-[#A1887F] hidden md:block"></div>

        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-[#3E2723]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Timeline of Zapote Bridge
        </motion.h2>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Early History */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">Early History</span>
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#A1887F]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                Zapote Bridge has served as a critical crossing over the Zapote River long before the advent of modern infrastructure,
                and its strategic location played an important role in local history.
              </p>
            </div>
          </motion.div>

          {/* The Battle of Zapote Bridge */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">1897</span>
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#A1887F]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                In 1897, during the Philippine Revolution, fierce battles took place near Zapote Bridge.
                This pivotal moment is captured in various artworks and records, highlighting the strategic significance
                and bravery of Filipino revolutionaries.
              </p>
            </div>
          </motion.div>

          {/* Post-Battle Era */}
          <motion.div className="flex flex-col md:flex-row" variants={itemVariants}>
            <div className="md:w-1/4 font-semibold text-2xl text-[#3E2723] mb-2 md:mb-0 relative">
              <span className="md:absolute md:right-8">Modern Era</span>
              <div className="hidden md:block absolute right-0 w-6 h-6 rounded-full bg-[#3E2723] border-4 border-[#f5f0e5] translate-x-1/2"></div>
            </div>
            <div className="md:w-3/4 bg-white/50 p-8 rounded-lg shadow-sm border border-[#A1887F]">
              <p className="text-xl text-[#3E2723] leading-relaxed">
                Today, Zapote Bridge not only continues to serve as a functional structure,
                but also stands as a testament to the rich historical legacy of the region.
                The bridge and its surrounding areas have become a source of inspiration for artists,
                as seen in celebrated paintings that immortalize its history.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#3E2723]">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-80">
            <Image
              src={image1}
              alt="Zapote Bridge scene 1"
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-80">
            <Image
              src={image2}
              alt="Zapote Bridge scene 2"
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-80">
            <Image
              src={image3}
              alt="Zapote Bridge battle scene"
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-80">
            <Image
              src={image4}
              alt="Anniversary celebration at Zapote Bridge"
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-80">
            <Image
              src={image5}
              alt="Zapote River Bridge in 1899"
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-4 text-center text-[#3E2723]">
          Additional Information
        </h2>
        <p className="text-xl text-[#3E2723] leading-relaxed mb-4">
          Zapote Bridge has been an enduring witness to the tumultuous events of Philippine history.
          This page honors not only the historical significance of the bridge but also celebrates the artistic interpretation
          presented in this painting. Through this artwork, the valor and spirit of those who fought for independence
          are vividly immortalized.
        </p>
        <p className="text-xl text-[#3E2723] leading-relaxed">
          The images showcased in the gallery capture various moments—from architectural details to dramatic battle scenes—
          that reflect both the practical and symbolic roles of Zapote Bridge in the nation&apos;s heritage.
        </p>
      </div>

      {/* References Section */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <p className="text-lg text-gray-600 text-center">
          Information sourced from{" "}
          <a
            href="https://en.wikipedia.org/wiki/Battle_of_Binakayan%E2%80%93Dalahican"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Wikipedia: Battle of Binakayan–Dalahican
          </a>
        </p>
      </div>

      {/* Decorative buildings silhouette at the bottom */}
      <div className="relative w-full h-12 overflow-hidden">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%233E2723'%3E%3Cpath d='M0,40 L25,40 L25,20 L35,20 L35,10 L45,10 L45,20 L55,20 L55,40 L75,40 L75,25 L85,25 L85,15 L95,15 L95,25 L105,25 L105,40 L125,40 L125,15 L135,15 L135,5 L145,5 L145,15 L155,15 L155,40 L175,40 L175,20 L185,20 L185,10 L195,10 L195,20 L205,20 L205,40 L225,40 L225,25 L235,25 L235,15 L245,15 L245,25 L255,25 L255,40 L275,40 L275,15 L285,15 L285,5 L295,5 L295,15 L305,15 L305,40 L325,40 L325,20 L335,20 L335,10 L345,10 L345,20 L355,20 L355,40 L375,40 L375,25 L385,25 L385,15 L395,15 L395,25 L405,25 L405,40 L425,40 L425,15 L435,15 L435,5 L445,5 L445,15 L455,15 L455,40 L475,40 L475,20 L485,20 L485,10 L495,10 L495,20 L505,20 L505,40 L525,40 L525,25 L535,25 L535,15 L545,15 L545,25 L555,25 L555,40 L575,40 L575,15 L585,15 L585,5 L595,5 L595,15 L605,15 L605,40 L625,40 L625,20 L635,20 L635,10 L645,10 L645,20 L655,20 L655,40 L675,40 L675,25 L685,25 L685,15 L695,15 L695,25 L705,25 L705,40 L725,40 L725,15 L735,15 L735,5 L745,5 L745,15 L755,15 L755,40 L775,40 L775,20 L785,20 L785,10 L795,10 L795,20 L805,20 L805,40 L825,40 L825,25 L835,25 L835,15 L845,15 L845,25 L855,25 L855,40 L875,40 L875,15 L885,15 L885,5 L895,5 L895,15 L905,15 L905,40 L925,40 L925,20 L935,20 L935,10 L945,10 L945,20 L955,20 L955,40 L975,40 L975,25 L985,25 L985,15 L995,15 L995,25 L1000,25 L1000,40 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ZapotePage;
