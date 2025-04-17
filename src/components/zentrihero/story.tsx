"use client";

import React from "react";
import { motion, useMotionValue } from "framer-motion";
import AnimatedTitle from "./animatedtitle";
import Button from "./button";

export default function FloatingImage() {
  // Motion values for rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Shared spring config
  const spring = { type: "spring", stiffness: 300, damping: 20 };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    rotateY.set(((x - cx) / cx) * 10);
    rotateX.set(((y - cy) / cy) * -10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      id="story"
      className="min-h-screen w-screen bg-[radial-gradient(ellipse_at_bottom_left,#fae8b4,#EAEEFE)] flex flex-col items-center justify-center p-6"
    >
      <p className="font-general text-sm uppercase md:text-[10px]">
        the multiversal IP world
      </p>

      <div className="relative w-full max-w-4xl">
        <AnimatedTitle
          title="the st<b>o</b>ry of <br /> a hidden real<b>m</b>"
          containerClass="mt-5 pointer-events-none mix-blend-difference text-center text-4xl md:text-6xl"
        />

        <motion.div
          className="mt-8 mx-auto w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 600 }}
        >
          <motion.img
            src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744777448/product-image_ltfqke.png"
            alt="Floating Illustration"
            className="w-full h-full object-cover"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={spring}
          />
        </motion.div>
      </div>

      <div className="mt-[-5rem] w-full max-w-4xl flex justify-center md:justify-end">
        <div className="bg-black/40 p-6 rounded-lg text-center md:text-left">
          <p className="text-lg md:text-xl font-circular-web text-violet-50">
            Where realms converge, lies Zentry and the boundless pillar.
            Discover its secrets and shape your fate amidst infinite
            opportunities.
          </p>
          <Button
            id="realm-btn"
            title="Discover Prologue"
            containerClass="mt-5"
            leftIcon={null}
            rightIcon={null}
          />
        </div>
      </div>
    </section>
  );
}
