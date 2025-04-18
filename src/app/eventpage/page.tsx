import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/dbConnect"
import { getUserIdByToken } from "@/lib/auth"
import Event, { type IEvent } from "@/models/Event"
import Image from "next/image"
import { ComprehensiveEventCard } from "@/components/eventpageui/comprehensive-event-card"

export const runtime = "nodejs"

export default async function EventPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("sessionToken")?.value
  if (!token) {
    redirect("/signin")
  }

  await dbConnect()
  const userId = await getUserIdByToken(token)
  if (!userId) {
    redirect("/signin")
  }

  const approvedEvents = await Event.find({ status: "approved" }).lean<IEvent[]>()

  // Map over events to convert ObjectId and Date to plain strings
  const events = approvedEvents.map(ev => ({
    ...ev,
    _id: ev._id.toString(),
    date: ev.date.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-[#f5f0e5]">
      {/* Decorative buildings silhouette at the top */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        {/* …SVG background… */}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner with overlay and text */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg border border-[#e6d7c3]">
          <Image
            src="https://res.cloudinary.com/dxr6eovhv/image/upload/v1744857079/eplore_1_tepw9w.png"
            alt="Events Banner"
            fill
            quality={100}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#654321]/70 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              {/* <-- escaped apostrophe here --> */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f0e5] mb-4 drop-shadow-md">
                Discover Cavite&apos;s Events
              </h1>
              <p className="text-[#f5f0e5]/90 text-lg md:text-xl drop-shadow-md">
                Explore cultural celebrations, historical commemorations, and community gatherings
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#654321]">Upcoming Events</h2>
            <div className="ml-4 h-1 flex-grow bg-gradient-to-r from-[#8B4513]/50 to-transparent rounded-full"></div>
          </div>

          {events.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center border border-[#e6d7c3] shadow-inner">
              {/* …no-events UI… */}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(ev => (
                <ComprehensiveEventCard key={ev._id} event={ev} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Decorative buildings silhouette at the bottom */}
      <div className="relative w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        {/* …rotated SVG background… */}
      </div>
    </div>
  )
}
