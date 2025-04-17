// File: src/components/eventpageui/comprehensive-event-card.tsx
"use client";

import React, { useState, ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  Info,
  X,
} from "lucide-react";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    date: string;           // ISO
    location: string;
    description?: string;
    image?: string;
    time?: string;
    organizer?: string;
    category?: string;
    [key: string]: unknown;
  };
}

export function ComprehensiveEventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Build a strictly‑typed details array
  const details: { icon: ReactNode; text: string }[] = [
    { icon: <Calendar className="h-5 w-5 mr-2 text-[#8B4513]" />, text: formatDate(eventDate) },
    { icon: <MapPin className="h-5 w-5 mr-2 text-[#8B4513]" />, text: event.location },
  ];
  if (typeof event.time === "string") {
    details.push({ icon: <Clock className="h-5 w-5 mr-2 text-[#8B4513]" />, text: event.time });
  }
  if (typeof event.organizer === "string") {
    details.push({ icon: <User className="h-5 w-5 mr-2 text-[#8B4513]" />, text: event.organizer });
  }
  if (typeof event.category === "string") {
    details.push({ icon: <Tag className="h-5 w-5 mr-2 text-[#8B4513]" />, text: event.category });
  }

  const hoverTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <>
      <motion.div
        onClick={openModal}
        className="bg-[#f5f0e5] rounded-xl overflow-hidden shadow-md border border-[#e6d7c3] cursor-pointer"
        initial={{
          boxShadow:
            "0 4px 6px -1px rgba(101,67,33,0.1), 0 2px 4px -1px rgba(101,67,33,0.06)",
        }}
        whileHover={{
          scale: 1.02,
          y: -5,
          boxShadow:
            "0 20px 25px -5px rgba(101,67,33,0.1), 0 10px 10px -5px rgba(101,67,33,0.04)",
        }}
        transition={hoverTransition}
      >
        <div className="relative h-48 w-full">
          {typeof event.image === "string" ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, (max-width:1200px)50vw,33vw"
            />
          ) : (
            <div className="w-full h-full bg-[#e6d7c3] flex items-center justify-center">
              <span className="text-[#8B4513]/60">No image</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-[#f5f0e5]/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-[#654321] border border-[#e6d7c3] shadow-sm">
            {formatDate(eventDate)}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 line-clamp-1 text-[#654321]">
            {event.title}
          </h3>
          <div className="flex items-center text-[#8B4513] mb-3">
            <MapPin className="h-5 w-5 mr-1" />
            <span className="truncate">{event.location}</span>
          </div>
          {typeof event.description === "string" && (
            <p className="text-[#8B4513]/80 line-clamp-2 mb-4">
              {event.description}
            </p>
          )}
          <div className="flex justify-end">
            <span className="text-[#8B4513] hover:text-[#654321] font-medium flex items-center gap-1">
              View details →
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-[#f5f0e5] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#8B4513]/20">
                <h3 className="text-2xl font-bold text-[#654321]">
                  {event.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-[#8B4513] hover:text-[#654321] bg-[#e6d7c3] hover:bg-[#d7c3a7] rounded-full p-1.5"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {typeof event.image === "string" && (
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px)100vw,768px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#654321]/50 to-transparent" />
                </div>
              )}

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.map(({ icon, text }, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center bg-[#e6d7c3] px-3 py-2 rounded-lg"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(101,67,33,0.1)",
                      }}
                      transition={hoverTransition}
                    >
                      {icon}
                      <span className="text-[#654321]">{text}</span>
                    </motion.div>
                  ))}
                </div>

                {typeof event.description === "string" && (
                  <motion.div
                    className="bg-[#e6d7c3]/30 p-4 rounded-lg"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 12px rgba(101,67,33,0.1)",
                    }}
                    transition={hoverTransition}
                  >
                    <h4 className="flex items-center text-lg font-semibold mb-2 text-[#654321]">
                      <Info className="h-5 w-5 mr-2 text-[#8B4513]" />
                      Description
                    </h4>
                    <p className="text-[#8B4513] whitespace-pre-line">
                      {event.description}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end p-6 border-t border-[#8B4513]/20">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-[#8B4513] hover:bg-[#654321] text-[#f5f0e5] rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
