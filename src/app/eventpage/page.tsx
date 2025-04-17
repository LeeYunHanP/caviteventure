// File: app/eventpage/page.tsx
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import your card so it’s code‑split:
const ComprehensiveEventCard = dynamic(
  () =>
    import("@/components/eventpageui/comprehensive-event-card").then(
      (m) => m.ComprehensiveEventCard
    ),
  { ssr: false }
);

type Event = {
  _id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  description?: string;
};

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  // Fetch next page of events
  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const res = await fetch(
      `/api/events?limit=6${cursor ? `&cursor=${cursor}` : ""}`
    );
    if (!res.ok) return;
    const { events: newEvents, nextCursor } = await res.json();
    setEvents((prev) => [...prev, ...newEvents]);
    setCursor(nextCursor || null);
    setHasMore(Boolean(nextCursor));
  }, [cursor, hasMore]);

  // Infinite scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    if (loader.current) {
      obs.observe(loader.current);
    }
    return () => obs.disconnect();
  }, [loadMore]);

  // Back to top button
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e5] relative">
      {/* Top silhouette */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'><path d='M0,40 L25,40 L25,20 ... Z'/></svg>")`,
            backgroundSize: "1000px 40px",
          }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cloudinary Banner */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg border border-[#e6d7c3]">
          <Image
            src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744857079/eplore_1_tepw9w.png"
            alt="Events Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#654321]/70 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f0e5] mb-4 drop-shadow-md">
                Discover Cavite&apos;s Events
              </h1>
              <p className="text-[#f5f0e5]/90 text-lg md:text-xl drop-shadow-md">
                Explore cultural celebrations, historical commemorations, and
                community gatherings
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#654321]">
              Upcoming Events
            </h2>
            <div className="ml-4 h-1 flex-grow bg-gradient-to-r from-[#8B4513]/50 to-transparent rounded-full" />
          </div>

          {events.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center border border-[#e6d7c3] shadow-inner">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e6d7c3] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#8B4513]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-[#654321] text-lg font-medium">
                No approved events available at the moment.
              </p>
              <p className="text-[#8B4513]/70 mt-2">
                Check back later for new events!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<p>Loading events…</p>}>
                {events.map((ev) => (
                  <ComprehensiveEventCard
                    key={ev._id}
                    event={{ ...ev, date: ev.date.toString() }}
                  />
                ))}
              </Suspense>
            </div>
          )}

          {/* Loader div for infinite scroll */}
          <div ref={loader} className="h-8" />

          {!hasMore && events.length > 0 && (
            <p className="text-center text-gray-500 mt-6">
              You have reached the end.
            </p>
          )}
        </div>
      </main>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-3 bg-[#8B4513] text-white rounded-full shadow-lg hover:bg-[#654321] transition"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Bottom silhouette */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'><path d='M0,0 L25,0 ... Z'/></svg>")`,
            backgroundSize: "1000px 40px",
            transform: "rotate(180deg)",
          }}
        />
      </div>
    </div>
  );
}
