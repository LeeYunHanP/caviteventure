// File: app/updateevent/[id]/page.tsx

import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import UpdateEventClient from "./UpdateEventClient";

export default async function UpdateEventPage(
  { params }: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a Promise
  const { id } = await params;

  // Check authentication on the server side
  const session = (await getServerSession()) as Session & { user: { role?: string } } | null;
  const userRole = session?.user?.role;
  if (!userRole || (userRole !== 'admin' && userRole !== 'superadmin')) {
    redirect(`/signin?callbackUrl=/updateevent/${encodeURIComponent(id)}`);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    const event = await response.json();
    return <UpdateEventClient eventData={JSON.stringify(event)} />;
  } catch (error) {
    console.error("Error fetching event:", error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl text-red-600">Error loading event</h1>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }
}