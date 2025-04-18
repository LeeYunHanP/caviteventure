// File: src/components/eventpageui/ComprehensiveEventCard.client.tsx
"use client";

import React, { useState, useEffect, ReactNode } from "react";
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
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    date: string; // ISO
    location: string;
    description?: string;
    image?: string;
    time?: string;
    organizer?: string;
    category?: string;
    [key: string]: unknown;
  };
}

interface Comment {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  createdAt?: string;
}

export function ComprehensiveEventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");

  // Load existing comments on mount
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch(`/api/events/${event._id}/comments`);
        if (!res.ok) throw new Error("Failed to load comments");
        const data: Comment[] = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    }
    loadComments();
  }, [event._id]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const formatDateLong = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const details: { icon: ReactNode; text: string }[] = [
    { icon: <Calendar className="h-5 w-5 mr-2 text-[#8B4513]" />, text: formatDateLong(eventDate) },
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

  const submitComment = async () => {
    if (newRating < 1 || !newText.trim()) return;

    try {
      const res = await fetch(`/api/events/${event._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating, text: newText.trim() }),
      });

      if (!res.ok) {
        console.error("Failed to submit comment:", await res.text());
        return;
      }

      const saved: Comment = await res.json();
      setComments([saved, ...comments]);
      setNewRating(0);
      setNewText("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const likeComment = (id: string) => {
    setComments(
      comments.map(c => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };
  const dislikeComment = (id: string) => {
    setComments(
      comments.map(c => (c.id === id ? { ...c, dislikes: c.dislikes + 1 } : c))
    );
  };

  return (
    <>
      <motion.div
        onClick={openModal}
        className="bg-[#f5f0e5] rounded-xl overflow-hidden shadow-md border border-[#e6d7c3] cursor-pointer"
        initial={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
        transition={hoverTransition}
      >
        <div className="relative h-48 w-full">
          {event.image ? (
            <Image src={event.image} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[#e6d7c3] flex items-center justify-center">
              <span className="text-[#8B4513]/60">No image</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-[#654321] mb-2 line-clamp-1">
            {event.title}
          </h3>
          <p className="flex items-center text-[#8B4513] mb-3">
            <MapPin className="h-5 w-5 mr-1" /> {event.location}
          </p>
          {event.description && (
            <p className="text-[#8B4513]/80 line-clamp-2 mb-4">
              {event.description}
            </p>
          )}
          <div className="flex justify-end">
            <span className="text-[#8B4513] hover:text-[#654321] font-medium">
              View details →
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-[#f5f0e5] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#8B4513]/20">
                <h3 className="text-2xl font-bold text-[#654321]">{event.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-[#8B4513] hover:text-[#654321] bg-[#e6d7c3] rounded-full p-1"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {event.image && (
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#654321]/50 to-transparent" />
                </div>
              )}

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.map((d, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center bg-[#e6d7c3] px-3 py-2 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={hoverTransition}
                    >
                      {d.icon}
                      <span className="text-[#654321]">{d.text}</span>
                    </motion.div>
                  ))}
                </div>

                {event.description && (
                  <motion.div className="bg-[#e6d7c3]/30 p-4 rounded-lg" whileHover={{ scale: 1.02 }} transition={hoverTransition}>
                    <h4 className="flex items-center text-lg font-semibold mb-2 text-[#654321]">
                      <Info className="h-5 w-5 mr-2 text-[#8B4513]" /> Description
                    </h4>
                    <p className="text-[#8B4513] whitespace-pre-line">{event.description}</p>
                  </motion.div>
                )}

                {/* Comment & Rating Section */}
                <div className="bg-[#e6d7c3]/50 p-4 rounded-lg space-y-4">
                  <h4 className="text-lg font-semibold text-[#654321]">Comments & Rating</h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        onClick={() => setNewRating(i)}
                        className={`cursor-pointer ${i <= newRating ? "text-yellow-500" : "text-gray-300"}`}
                        size={20}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows={3}
                    placeholder="Write your comment..."
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                  />
                  <button
                    onClick={submitComment}
                    className="px-4 py-2 bg-[#654321] text-white rounded"
                  >
                    Submit
                  </button>

                  {comments.map(c => (
                    <div key={c.id} className="border-t border-gray-200 pt-4">
                      <div className="flex items-center mb-2">
                        {c.userImage ? (
                          <Image src={c.userImage} alt={c.userName} width={32} height={32} className="rounded-full" />
                        ) : (
                          <User className="h-8 w-8 text-gray-500" />
                        )}
                        <span className="ml-2 font-medium text-[#654321]">{c.userName}</span>
                        <div className="flex ml-auto">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              className={`${i <= c.rating ? "text-yellow-500" : "text-gray-300"}`}
                              size={16}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#654321] mb-2">{c.text}</p>
                      <div className="flex items-center text-sm text-[#654321]">
                        <button onClick={() => likeComment(c.id)} className="mr-4 flex items-center">
                          <ThumbsUp className="mr-1" size={16} /> {c.likes}
                        </button>
                        <button onClick={() => dislikeComment(c.id)} className="flex items-center">
                          <ThumbsDown className="mr-1" size={16} /> {c.dislikes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
