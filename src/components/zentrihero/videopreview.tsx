"use client";

import { ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface VideoPreviewProps {
  children: ReactNode;
}

export default function VideoPreview({ children }: VideoPreviewProps) {
  // Raw motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Spring config for smooth interpolation
  const springConfig = { stiffness: 200, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotX = useSpring(rotateX, springConfig);
  const springRotY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const xOffset = clientX - (rect.left + rect.width / 2);
    const yOffset = clientY - (rect.top + rect.height / 2);

    // translate at 20% of cursor distance, rotate up to ±15°
    x.set(xOffset * 0.2);
    y.set(yOffset * 0.2);
    rotateY.set((xOffset / (rect.width / 2)) * 15);
    rotateX.set((-yOffset / (rect.height / 2)) * 15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotX,
        rotateY: springRotY,
        perspective: 500,
      }}
      className="absolute z-50 inset-0 overflow-hidden rounded-lg flex items-center justify-center"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        className="origin-center rounded-lg"
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
