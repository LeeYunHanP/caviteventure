"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// New Cloudinary image URLs
const cogImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744771850/cog_ll6ckj.jpg";
const cylinderImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808221/cylinder_eweghq.jpg";
const noodleImageUrl =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808224/noodle_dx1ag9.jpg";

// Import your pages
import BinakayanPage from "@/components/homepage/binakayan";
import ZapotePage from "@/components/homepage/zapote";
import SanRoquePage from "@/components/homepage/sanroque";
import CasaDetajeroPage from "@/components/homepage/casadetajero";

export default function ClientHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // “_direction” isn’t read anywhere (yet), but we still
  // need the setter for manual / auto navigation
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_direction, setDirection] = useState<number>(0);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Define slides using the new images
  const slides = [
    {
      image: cogImageUrl,
      name: "Binakayan",
      date: "November 9–11, 1896",
      alt: "Cog image",
    },
    {
      image: cylinderImageUrl,
      name: "Zapote Bridge",
      date: "built in 1817",
      alt: "Cylinder image",
    },
    {
      image: noodleImageUrl,
      name: "San Roque Church",
      date: "1573",
      alt: "Noodle image",
    },
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto‑advance slides every 5 s (no “missing dependency” now)
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  /* ---------- FAQ toggle helpers ---------- */
  const faqs = [
    {
      question: "What historical sites can I visit in Cavite?",
      answer:
        "Cavite is home to numerous historical sites including Aguinaldo Shrine, Corregidor Island, Battle of Binakayan Monument, Zapote Bridge, San Roque Church, and Casa de Tajero among others. Each site offers a unique glimpse into Philippine history and culture.",
    },
    {
      question: "What is the best time to visit Cavite?",
      answer:
        "The best time to visit Cavite is during the dry season from November to May. This period offers pleasant weather for exploring outdoor historical sites and attending local festivals. December to February are particularly comfortable with cooler temperatures.",
    },
    {
      question: "Are there guided tours available for historical sites?",
      answer:
        "Yes, there are several guided tour options available. Many historical sites offer on-site guides, and there are also tour companies that provide comprehensive historical tours of Cavite. These guided experiences enhance your understanding of the rich history and cultural significance of each location.",
    },
    {
      question: "What local delicacies should I try in Cavite?",
      answer:
        "Cavite is known for several delicacies including Kakanin (rice cakes), Bibingkoy (glutinous rice balls), Pancit Pusit (squid noodles), Bacalao (salted cod dish), and Sampayna (local bread). Don't miss trying these authentic local foods during your visit to get a taste of Cavite's culinary heritage.",
    },
    {
      question: "How can I get around Cavite to visit multiple sites?",
      answer:
        "You can get around Cavite using public transportation like jeepneys and buses for budget travel. For more convenience, tricycles are good for short distances within towns. Renting a car or hiring a driver for the day is recommended if you plan to visit multiple sites across different municipalities in one day.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (idx: number) =>
    setOpenIndex(openIndex === idx ? null : idx);

  return (
    <>
      {/* ------------ Carousel ------------ */}
      <div className="relative w-full h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index
                ? "opacity-100 translate-x-0"
                : index < currentSlide ||
                  (currentSlide === 0 && index === slides.length - 1)
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            {/* Image + overlay */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                fill
                className={`object-cover transition-transform duration-1500 ${
                  currentSlide === index ? "scale-105 animate-slow-zoom" : ""
                }`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#654321]/60 to-[#654321]/80" />
            </div>

            {/* Caption */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#f5f0e5] px-4">
              <p
                className={`text-sm md:text-base opacity-80 mb-2 transition-all duration-1000 delay-300 ${
                  currentSlide === index
                    ? "translate-y-0 opacity-80"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {slide.date}
              </p>
              <h2
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 delay-500 ${
                  currentSlide === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                {slide.name}
              </h2>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#654321]/50 hover:bg-[#654321]/70 text-[#f5f0e5] p-2 rounded-full transition-all"
          aria-label="Previous slide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#654321]/50 hover:bg-[#654321]/70 text-[#f5f0e5] p-2 rounded-full transition-all"
          aria-label="Next slide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>

        {/* Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx
                  ? "bg-[#f5f0e5] w-4"
                  : "bg-[#f5f0e5]/50 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* ------------ Pages Below ------------ */}
      <div className="mt-8">
        <BinakayanPage />
      </div>
      <div className="mt-8">
        <ZapotePage />
      </div>
      <div className="mt-8">
        <SanRoquePage />
      </div>
      <div className="mt-8">
        <CasaDetajeroPage />
      </div>

      {/* ------------ FAQ ------------ */}
      <div className="bg-[#654321] text-[#f5f0e5] py-12 px-4 relative">
        {/* decorative skyline top */}
        <div className="absolute top-0 left-0 w-full h-8 overflow-hidden opacity-20 pointer-events-none">
          {/* (SVG path retained as‑is) */}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#e6d7c3] mb-8">
            Find answers to common questions about visiting Cavite&apos;s
            historical sites.
          </p>

          {/* Items */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-[#8B4513] pb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(i)}
                >
                  <span className="text-lg md:text-xl font-medium">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="ml-2 text-[#e6d7c3]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-[#e6d7c3] text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* decorative skyline bottom */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden opacity-20 pointer-events-none">
          {/* (SVG path retained as‑is) */}
        </div>
      </div>
    </>
  );
}
