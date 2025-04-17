// File: components/About.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import AnimatedTitle from "./animatedtitle";

export default function About() {
  // ref to the clip section
  const clipRef = useRef<HTMLDivElement>(null);

  // scroll progress within that section
  const { scrollYProgress } = useScroll({
    target: clipRef,
    offset: ["start center", "end center"],
  });

  // map scroll [0→1] to mask size & shape
  const clipWidth = useTransform(scrollYProgress, [0, 1], ["50vw", "100vw"]);
  const clipHeight = useTransform(scrollYProgress, [0, 1], ["50vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);

  // fade‑in variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
    }),
  };

  // back‑to‑top button
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="about" className="relative w-screen overflow-hidden bg-white">
      {/* Intro text */}
      <div className="relative z-10 mb-8 mt-36 flex flex-col items-center gap-5 px-4 sm:px-8">
        <motion.p
          className="font-general text-sm uppercase md:text-[10px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
        >
          Welcome to Cavite Venture
        </motion.p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
        />

        <motion.div
          className="about-subtext text-center space-y-2 max-w-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fadeIn}
        >
          <p>The Game of Games begins—your life, now an epic ADVENTURE</p>
          <p className="text-gray-500">
            Cavite unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </motion.div>
      </div>

      {/* Sticky clip‐mask section */}
      <div
        ref={clipRef}
        className="sticky top-0 h-screen w-screen flex items-center justify-center"
      >
        <motion.div
          style={{ width: clipWidth, height: clipHeight, borderRadius }}
          className="relative overflow-hidden"
        >
          <motion.img
            src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808992/DSC_0018_5_wtcrpj.jpg"
            alt="Binakayan Battle Scene"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-20 rounded-full bg-[#8B4513] p-3 text-white shadow-lg hover:bg-[#654321]"
          >
            ↑ Top
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
