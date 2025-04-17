// File: components/AnimatedTitle.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import clsx from "clsx";

interface AnimatedTitleProps {
  title: string;
  containerClass?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren",
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  title,
  containerClass,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={clsx("animated-title overflow-hidden", containerClass)}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {title.split("<br />").map((line, i) => (
        <div
          key={i}
          className="flex flex-wrap justify-center gap-2 px-4 md:gap-3"
        >
          {line.split(" ").map((word, j) => (
            <motion.span
              key={`${i}-${j}`}
              className="animated-word inline-block origin-top"
              variants={wordVariants}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default AnimatedTitle;
