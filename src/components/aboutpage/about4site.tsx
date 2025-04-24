"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X } from "lucide-react";

// — FRONT (card) IMAGE URLs (unchanged) —
const cloudinaryImage4 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778788/1_bewzpf.png";
const cloudinaryImage3 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778788/2_hfrahi.png";
const cloudinaryImage1 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778789/3_ld9bqo.png";
const cloudinaryImage2 =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744778789/4_umxt9q.png";

// — MODAL (full-size) IMAGE URLs —
const modalBinakayan =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744808992/DSC_0018_5_wtcrpj.jpg";
const modalZapote =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810678/June-12-2019-121st-Anniversary-of-the-Proclamation-of-Philippine-Independence-at-the-Batt-3_yhcv4y.jpg";
const modalCasa =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744809933/casa_fnca4v.jpg";
const modalSanRoque =
  "https://res.cloudinary.com/dxr6eovhv/image/upload/v1744810301/sanroque1_wyz0fz.jpg";

interface HistoricalPlace {
  // front card
  thumb: string;
  // lightbox/modal
  modalImage: string;
  alt: string;
  title: string;
  year: string;
  description: string;
}

const historicalPlaces: HistoricalPlace[] = [
  {
    thumb: cloudinaryImage4,
    modalImage: modalBinakayan,
    alt: "Battle of Binakayan",
    title: "Battle of Binakayan",
    year: "November 9–11, 1896",
    description:
      "The Battle of Binakayan was a decisive Filipino victory during the Philippine Revolution against Spanish colonial rule. Led by Emilio Aguinaldo and Artemio Ricarte, Filipino revolutionary forces successfully defended their positions in Binakayan and Dalahican against Spanish attacks. This victory boosted Filipino morale and demonstrated their military capabilities. The battle is considered one of the most significant early victories of the revolution, as it secured Filipino control over key areas in Cavite province and forced Spanish troops to retreat to Manila. Today, the site stands as a testament to Filipino courage and determination in their fight for independence.",
  },
  {
    thumb: cloudinaryImage3,
    modalImage: modalZapote,
    alt: "Battle of Zapote Bridge",
    title: "Battle of Zapote Bridge",
    year: "Feb 17, 1897",
    description:
      "The Zapote River and Bridge remains to be a silent witness to two fierce battles. The first was the battle against Spain on February 17, 1897. One of the unsung heroes who fought fiercely against the Spaniards was Bacoor’s Katipunan leader Gil Ignacio. This first battle also saw the death of more than 450 Filipinos that included the civil engineer turned Lieutenant General Edilberto Evangelista. Two years later, on June 13, 1899, another battle was fought here by the Filipinos, this time against the Americans. The new colonizers were commanded by Major General Henry W. Lawton. Dubbed as the second largest battle of the Philippine-American War, the Filipino army was led by General Artemio Ricarte, General Guillermo Masangkay, and Bacoor City’s very own, General Mariano Noriel.",
  },
  {
    thumb: cloudinaryImage1,
    modalImage: modalCasa,
    alt: "Casa Tejero",
    title: "Casa Tejero",
    year: "March 22, 1897",
    description:
      "Casa Tejero in Cavite was the site of the historic Tejeros Convention, a significant event in Philippine history. On March 22, 1897, revolutionary leaders gathered here to establish the first Philippine Republic and elect its officers. This convention marked a crucial transition from the Katipunan revolutionary society to a formal government structure. Emilio Aguinaldo was elected as President, while Andrés Bonifacio, the founder of the Katipunan, was elected as Director of the Interior. However, his qualifications were questioned, leading to a dramatic split in the revolutionary movement. The historic building represents a pivotal moment in the birth of Philippine democracy and the complex path to independence.",
  },
  {
    thumb: cloudinaryImage2,
    modalImage: modalSanRoque,
    alt: "San Roque Church",
    title: "San Roque Church",
    year: "Established 1586",
    description:
      "San Roque Church in Cavite is one of the oldest churches in the Philippines, with its origins dating back to 1602. Named after Saint Roch (San Roque), the patron saint of the sick, the church has stood as a spiritual beacon for centuries. The church features Spanish colonial architecture with thick stone walls, buttresses, and ornate religious artwork. Throughout its history, San Roque Church has survived wars, natural disasters, and the passage of time, becoming not just a place of worship but a living museum of Filipino faith and resilience. The church continues to serve the community today, hosting religious ceremonies and standing as a testament to Cavite&aposs rich cultural and religious heritage.",
  },
];

const HistoricalCard: React.FC<{
  place: HistoricalPlace;
  onOpen: (place: HistoricalPlace) => void;
}> = ({ place, onOpen }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xOffset = e.clientX - (rect.left + rect.width / 2);
    const yOffset = e.clientY - (rect.top + rect.height / 2);
    x.set(xOffset * 0.05);
    y.set(yOffset * 0.05);
    rotateY.set(xOffset / 20);
    rotateX.set(-yOffset / 20);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(place)}
      style={{ x, y, rotateX, rotateY, transformPerspective: 600 }}
    >
      <div className="relative w-full h-[350px] overflow-hidden rounded-lg shadow-md border-2 border-[#8B4513]/20 bg-[#f9f9f9]">
        <div className="relative h-[250px] w-full overflow-hidden">
          <Image
            src={place.thumb}
            alt={place.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-[#654321] font-bold text-xl">{place.title}</h3>
          <p className="text-[#8B4513] text-sm mt-1">{place.year}</p>
          <div className="mt-2 flex justify-end">
            <span className="text-[#8B4513]/70 text-sm italic">
              Click to learn more
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-[#654321]/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

const CenterAbout: React.FC = () => {
  const [selected, setSelected] = useState<HistoricalPlace | null>(null);

  const openImage = (place: HistoricalPlace) => {
    setSelected(place);
    document.body.style.overflow = "hidden";
  };
  const closeImage = () => {
    setSelected(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f0e5] relative">
      {/* Top silhouette */}
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\&aposhttp://www.w3.org/2000/svg\&apos viewBox=\&apos0 0 1000 40\&apos fill=\&apos%23654321\&apos%3E…%3C/svg%3E")',
            backgroundSize: "1000px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.h2
          className="text-4xl font-bold text-[#654321] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Historical Places
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {historicalPlaces.map((place, i) => (
            <HistoricalCard key={i} place={place} onOpen={openImage} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
          >
            <motion.div
              className="relative max-w-7xl w-full bg-[#f5f0e5] rounded-lg overflow-hidden shadow-2xl max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#8B4513]/20 bg-[#654321]">
                <h3 className="text-xl font-bold text-[#f5f0e5]">
                  {selected.title}
                </h3>
                <motion.button
                  className="p-1 rounded-full bg-[#f5f0e5]/20 text-[#f5f0e5] hover:bg-[#f5f0e5]/30 transition-colors"
                  onClick={closeImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close image"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
                <div className="w-full lg:w-3/5 relative h-[400px] sm:h-[500px] lg:h-[600px] bg-[#654321]/10">
                  <Image
                    src={selected.modalImage}
                    alt={selected.alt}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                    className="p-4"
                  />
                </div>
                <div className="w-full lg:w-2/5 p-6 flex flex-col overflow-y-auto">
                  <span className="inline-block bg-[#8B4513]/10 px-3 py-1 rounded-full text-sm font-medium text-[#8B4513] mb-2">
                    {selected.year}
                  </span>
                  <h4 className="text-2xl font-bold text-[#654321] mb-4">
                    {selected.title}
                  </h4>
                  <p className="text-[#8B4513] text-justify leading-relaxed">
                    {selected.description}
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent" />
                  <p className="mt-4 text-center text-[#654321] text-sm italic">
                    Visit this historical site to experience Cavite&aposs rich heritage
                  </p>
                </div>
              </div>

              {/* Bottom silhouette */}
              <div className="relative w-full h-8 overflow-hidden opacity-20">
                <div
                  className="w-full h-full bg-repeat-x"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=\&aposhttp://www.w3.org/2000/svg\&apos viewBox=\&apos0 0 1000 40\&apos fill=\&apos%23654321\&apos%3E…%3C/svg%3E")',
                    backgroundSize: "1000px 40px",
                    transform: "rotate(180deg)",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CenterAbout;
