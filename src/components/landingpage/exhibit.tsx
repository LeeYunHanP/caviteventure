"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Cloudinary image URLs for updated assets
const iconMap =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778019/iconmapremove_t28kfn.png";
const iconRound =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778019/iconround_ynr3lo.png";

/**
 * Cloudinary Image Loader
 * Injects auto format, quality, and width-based resizing transformations for better performance.
 */
const cloudinaryLoader = ({ src, width }: { src: string; width?: number }) => {
  const url = new URL(src);
  const transformation = width
    ? `f_auto,q_auto,w_${width},dpr_auto`
    : `f_auto,q_auto,dpr_auto`;
  const [base, rest] = url.pathname.split("/upload/");
  url.pathname = `${base}/upload/${transformation}/${rest}`;
  return url.toString();
};

const ExhibitPro: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    if (hoveredCard !== cardId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-16 xl:px-24">
        {/* Header */}
        <div className="text-center">
          <motion.div
            className="tag text-lg font-medium text-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Everything you need to explore
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Explore both 3D and Augmented Reality
          </motion.h2>

          <motion.p
            className="mt-4 text-md sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Enjoy exploring the history of Cavite in both <strong>3D</strong> and{" "}
            <strong>Augmented Reality</strong>. Experience a{" "}
            <strong>modern discovery of the past</strong> through{" "}
            <strong>Cavite Venture</strong>.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          className="flex flex-wrap justify-center mt-12 gap-8"
          initial="hidden"
          animate="visible"
        >
          {/* 3D Museum Card */}
          <Link href="/signup" passHref>
            <motion.div
              ref={(el) => {
                containerRefs.current[1] = el;
              }}
              className="bg-white shadow-lg rounded-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px] h-[320px] sm:h-[380px] lg:h-[450px] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer p-6 hover:shadow-2xl transition-all duration-500"
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05 }}
              custom={1}
              variants={cardVariants}
            >
              <Image
                loader={cloudinaryLoader}
                src={iconMap}
                width={220}
                height={220}
                alt="3D Museum"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
                priority
              />
              <h3 className="mt-4 font-bold text-lg sm:text-xl">3D Museum</h3>
              <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700 text-center">
                Explore Cavite&apos;s history in a <strong>3D museum</strong> and interact with digital exhibits.
              </p>
              {hoveredCard === 1 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.5), transparent 200px)`,
                  }}
                />
              )}
            </motion.div>
          </Link>

          {/* Augmented Reality Card */}
          <Link href="/signup" passHref>
            <motion.div
              ref={(el) => {
                containerRefs.current[2] = el;
              }}
              className="bg-white shadow-lg rounded-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px] h-[320px] sm:h-[380px] lg:h-[450px] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer p-6 hover:shadow-2xl transition-all duration-500"
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05 }}
              custom={2}
              variants={cardVariants}
            >
              <Image
                loader={cloudinaryLoader}
                src={iconRound}
                width={220}
                height={220}
                alt="Augmented Reality"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
                priority
              />
              <h3 className="mt-4 font-bold text-lg sm:text-xl">Augmented Reality</h3>
              <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700 text-center">
                Experience <strong>Augmented Reality</strong> to uncover Cavite&apos;s rich history like never before.
              </p>
              {hoveredCard === 2 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.5), transparent 200px)`,
                  }}
                />
              )}
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExhibitPro;
