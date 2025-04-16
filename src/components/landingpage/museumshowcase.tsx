"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Cloudinary Image Loader
 * Adds auto format, quality, width‑based resizing and DPR adjustments.
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

// Cloudinary image URLs
const productImage =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744777448/product-image_ltfqke.png";
const tubeImage =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744777447/tube_kwbpkf.png";
const pyramidImage =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744777447/pyramid_wmbsax.png";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax animations for smooth vertical translation and fade
  const translateY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.8, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white to-[#fae8b4] py-24 xl:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        {/* Header Section */}
        <div className="max-w-[640px] mx-auto text-center">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="tag font-cinzel text-xl md:text-2xl text-gray-800">
              Discover About Cavite
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text font-cinzel leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            A More Effective Way to Explore Cavite
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl leading-relaxed text-[#80775c] mt-5 font-cinzel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Effortlessly explore some parts of unpopular places in Cavite
          </motion.p>
        </div>

        {/* Showcase Images */}
        <div className="relative mt-14 flex justify-center items-center">
          {/* Main Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-6xl"
          >
            <Image
              loader={cloudinaryLoader}
              src={productImage}
              alt="Showcase of a product representing Cavite exploration"
              className="rounded-lg shadow-lg"
              priority
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1600px"
            />
          </motion.div>

          {/* Floating Pyramid Image */}
          <motion.div
            className="hidden md:block absolute -right-10 lg:-right-24 -top-10 lg:-top-24"
            style={{ translateY, opacity }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              loader={cloudinaryLoader}
              src={pyramidImage}
              alt="Pyramid floating decoration"
              width={350}
              height={350}
              sizes="(max-width: 768px) 50vw, 350px"
              className="drop-shadow-lg"
            />
          </motion.div>

          {/* Floating Tube Image */}
          <motion.div
            className="hidden md:block absolute bottom-12 lg:bottom-20 -left-10 lg:-left-24"
            style={{ translateY, opacity }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              loader={cloudinaryLoader}
              src={tubeImage}
              alt="Tube floating decoration"
              width={350}
              height={350}
              sizes="(max-width: 768px) 50vw, 350px"
              className="drop-shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
