export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import CreateEventClient from "./CreateEventClient";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function CreateEventPage() {
  /* ── 1 ▸ absolute base URL ───────────────────────────────────────── */
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseURL = `${protocol}://${host}`;          // e.g. https://caviteventure.com

  /* ── 2 ▸ forward cookies when we cross origins ───────────────────── */
  const cookieHeader = (await cookies()).toString();

  /* ── 3 ▸ auth guard ──────────────────────────────────────────────── */
  const authRes = await fetch(`${baseURL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
  if (!authRes.ok) redirect("/signin");

  const auth = await authRes.json();
  if (!auth.isAuthenticated || auth.user?.role !== "admin") redirect("/signin");

  /* ── 4 ▸ secondary DB check (optional) ───────────────────────────── */
  await dbConnect();
  const dbUser = await User.findById(auth.user._id).lean();
  if (!dbUser || dbUser.role !== "admin") redirect("/signin");

  /* ── 5 ▸ render Client component ────────────────────────────────── */
  return <CreateEventClient />;
}
