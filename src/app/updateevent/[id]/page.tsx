// File: app/updateevent/[id]/page.tsx

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateEventClient from "./UpdateEventClient";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export default async function UpdateEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1) Wait for the promise
  const { id } = await params;

  // 2) Validate user as admin, etc.
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map(({ name, value }: { name: string; value: string }) => `${name}=${value}`)
    .join("; ");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caviteventure.vercel.app/";
  const authMeUrl = `${baseUrl}/api/auth/me`;
  const authRes = await fetch(authMeUrl, { headers: { cookie: cookieHeader }, cache: "no-store" });
  const authData = await authRes.json();

  if (!authData?.isAuthenticated || authData?.user?.role !== "admin") {
    redirect("/signin");
  }

  // 3) Connect to DB & fetch the event
  await dbConnect();
  const eventDoc = await Event.findById(id).lean();
  if (!eventDoc) {
    redirect("/dashboard");
  }

  // 4) Pass event to the client component
  return <UpdateEventClient eventData={JSON.stringify(eventDoc)} />;
}
