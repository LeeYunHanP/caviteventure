"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import {
  Calendar,
  MapPin,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface IEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function SuperAdminEventApproval() {
  /* ------------------------------- UI STATE -------------------------------- */
  const [pendingEvents, setPendingEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");


  /* ---------------------------- REFS & HELPERS ----------------------------- */
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const addToCardRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             DATA FETCHING                                  */
  /* -------------------------------------------------------------------------- */

  const fetchPendingEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events/pending");
      if (!res.ok) throw new Error("Failed to fetch pending events.");
      const data = await res.json();
      setPendingEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    setActionInProgress(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve event");
      await fetchPendingEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (eventId: string, reason: string) => {
    setActionInProgress(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject event");
      await fetchPendingEvents();
      closeRejectModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionInProgress(null);
    }
  };

  /* ---------------------------- MODAL HANDLERS ----------------------------- */

  const openRejectModal = (event: IEvent) => {
    setSelectedEvent(event);
    setIsRejectModalOpen(true);
    setRejectionReason("");
  };
  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedEvent(null);
    setRejectionReason("");
  };


  /* ------------------------------- GSAP ----------------------------------- */

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const xOffset = clientX - (rect.left + rect.width / 2);
    const yOffset = clientY - (rect.top + rect.height / 2);

    gsap.to(currentTarget, {
      x: xOffset * 0.03,
      y: yOffset * 0.03,
      rotationY: xOffset / 25,
      rotationX: -yOffset / 25,
      transformPerspective: 800,
      duration: 0.6,
      ease: "power1.out",
      boxShadow:
        "0 10px 15px -3px rgba(101, 67, 33, 0.1), 0 4px 6px -2px rgba(101, 67, 33, 0.05)",
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      duration: 0.6,
      ease: "power1.out",
    });
  };

  const handleRefreshButtonHover = () => {
    if (refreshButtonRef.current) {
      gsap.to(refreshButtonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  const handleRefreshButtonLeave = () => {
    if (refreshButtonRef.current) {
      gsap.to(refreshButtonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  const handleRefresh = () => {
    if (refreshButtonRef.current) {
      gsap.to(refreshButtonRef.current.querySelector("svg"), {
        rotation: 360,
        duration: 1,
        ease: "power1.inOut",
      });
    }
    fetchPendingEvents();
  };

  useEffect(() => {
    if (isRejectModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isRejectModalOpen]);

  /* ----------------------------- LIFECYCLE -------------------------------- */

  useEffect(() => {
    fetchPendingEvents();
    const cardsSnapshot = [...cardRefs.current];
    return () => {
      cardsSnapshot.forEach(card => {
        gsap.to(card, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.6, ease: "power1.out" });
      });
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  RENDER                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#f5f0e5] p-4 md:p-6 relative">
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='...'/.../svg>")`,
            backgroundSize: "1000px 40px",
          }}
        />
      </div>

      {/* Header row */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5d4037]">Event Approval</h1>
            <p className="text-[#8d6e63] mt-1">Review and manage pending event submissions</p>
          </div>

          <button
            ref={refreshButtonRef}
            onClick={handleRefresh}
            onMouseEnter={handleRefreshButtonHover}
            onMouseLeave={handleRefreshButtonLeave}
            disabled={loading}
            className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-[#e6d7c3]">
            <div className="animate-spin mb-4 mx-auto"><RefreshCw size={32} /></div>
            <p className="text-[#5d4037] font-medium">Loading pending events...</p>
          </div>
        )}

        {/* No events */}
        {!loading && pendingEvents.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-[#e6d7c3]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f8f5f0] flex items-center justify-center">
              <Info size={24} className="text-[#8d6e63]" />
            </div>
            <h3 className="text-[#5d4037] font-bold text-xl mb-2">No Pending Events</h3>
            <p className="text-[#8d6e63]">
              There are no events waiting for approval at the moment.
            </p>
          </div>
        )}

        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {pendingEvents.map((ev) => (
            <div
              key={ev._id}
              ref={addToCardRefs}
              className="bg-white rounded-lg shadow-md border border-[#e6d7c3] overflow-hidden transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-[#e6d7c3]">
                {ev.image ? (
                  <Image
                    src={ev.image}
                    alt={ev.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar size={48} className="text-[#8d6e63]/50" />
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-[#f5f0e5]/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-[#654321] shadow-sm border border-[#e6d7c3]">
                  {new Date(ev.date).toLocaleDateString()}
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-[#5d4037]">
                  {ev.title}
                </h3>

                <div className="flex items-center text-[#8d6e63] mb-3">
                  <MapPin size={16} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>

                {ev.description && (
                  <p className="text-[#8d6e63] line-clamp-2 mb-4 text-sm">
                    {ev.description}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex justify-between mt-4 gap-3">
                  <button
                    onClick={() => handleApprove(ev._id)}
                    disabled={actionInProgress === ev._id}
                    className="flex-1 bg-[#4caf50] hover:bg-[#388e3c] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionInProgress === ev._id ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Approve
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openRejectModal(ev)}
                    disabled={actionInProgress === ev._id}
                    className="flex-1 bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------- MODAL -------------------------------- */}
      {isRejectModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#e6d7c3]">
              <h3 className="text-xl font-bold text-[#5d4037]">Reject Event</h3>
              <p className="text-[#8d6e63] mt-1 text-sm">
                Please provide a reason for rejecting&nbsp;
                &quot;{selectedEvent.title}&quot;
              </p>
            </div>

            <div className="p-6">
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-[#5d4037] mb-2"
              >
                Reason for Rejection
              </label>
              <textarea
                id="rejectionReason"
                rows={4}
                className="w-full px-3 py-2 border border-[#e6d7c3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#f8f5f0] transition-all duration-200"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this event is being rejected..."
                required
              />
            </div>

            <div className="p-6 border-t border-[#e6d7c3] flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 border border-[#e6d7c3] rounded-lg text-[#5d4037] hover:bg-[#f8f5f0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleReject(selectedEvent._id, rejectionReason)
                }
                disabled={
                  !rejectionReason.trim() ||
                  actionInProgress === selectedEvent._id
                }
                className="px-4 py-2 bg-[#f44336] text-white rounded-lg hover:bg-[#d32f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionInProgress === selectedEvent._id ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Reject Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative bottom silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x rotate-180"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,0 L25,0 L25,20 L35,20 L35,30 L45,30 L45,20 L55,20 L55,0 L75,0 L75,15 L85,15 L85,25 L95,25 L95,15 L105,15 L105,0 L125,0 L125,25 L135,25 L135,35 L145,35 L145,25 L155,25 L155,0 L175,0 L175,20 L185,20 L185,30 L195,30 L195,20 L205,20 L205,0 L225,0 L225,15 L235,15 L235,25 L245,25 L245,15 L255,15 L255,0 L275,0 L275,25 L285,25 L285,35 L295,35 L295,25 L305,25 L305,0 L325,0 L325,20 L335,20 L335,30 L345,30 L345,20 L355,20 L355,0 L375,0 L375,15 L385,15 L385,25 L395,25 L395,15 L405,15 L405,0 L425,0 L425,25 L435,25 L435,35 L445,35 L445,25 L455,25 L455,0 L475,0 L475,20 L485,20 L485,30 L495,30 L495,20 L505,20 L505,0 L525,0 L525,15 L535,15 L535,25 L545,25 L545,15 L555,15 L555,0 L575,0 L575,25 L585,25 L585,35 L595,35 L595,25 L605,25 L605,0 L625,0 L625,20 L635,20 L635,30 L645,30 L645,20 L655,20 L655,0 L675,0 L675,15 L685,15 L685,25 L695,25 L695,15 L705,15 L705,0 L725,0 L725,25 L735,25 L735,35 L745,35 L745,25 L755,25 L755,0 L775,0 L775,20 L785,20 L785,30 L795,30 L795,20 L805,20 L805,0 L825,0 L825,15 L835,15 L835,25 L845,25 L845,15 L855,15 L855,0 L875,0 L875,25 L885,25 L885,35 L895,35 L895,25 L905,25 L905,0 L925,0 L925,20 L935,20 L935,30 L945,30 L945,20 L955,20 L955,0 L975,0 L975,15 L985,15 L985,25 L995,25 L995,15 L1000,15 L1000,0 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        />
      </div>
    </div>
  );
}
