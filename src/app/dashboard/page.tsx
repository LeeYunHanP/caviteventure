/* ── src/app/dashboard/page.tsx ─────────────────────────────────────── */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import dbConnect from "@/lib/dbConnect";

export default async function DashboardPage() {
  /* 1 ▸ absolute origin from request headers ------------------------- */
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  // fallback for build-time/ISR where headers() may be empty
  const origin =
    host ??
    process.env.VERCEL_URL ??
    "localhost:3000"; // sensible default for local dev
  const protocol = origin.startsWith("localhost") ? "http" : "https";
  const baseURL = `${protocol}://${origin}`; // e.g. https://caviteventure.com

  /* 2 ▸ forward incoming cookies when we cross origins --------------- */
  const cookieHeader = (await cookies()).toString(); // → "k=v; k2=v2"

  /* 3 ▸ authentication ---------------------------------------------- */
  const authRes = await fetch(`${baseURL}/api/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
  if (!authRes.ok) redirect("/signin");

  const auth = await authRes.json();
  if (!auth.isAuthenticated || auth.user?.role !== "admin") redirect("/signin");

  /* 4 ▸ dashboard data ---------------------------------------------- */
  await dbConnect();
  const dashRes = await fetch(`${baseURL}/api/admin/dashboard`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
  if (!dashRes.ok) redirect("/signin");

  const dash = await dashRes.json();
  if (!dash.success) redirect("/signin");

  /* 5 ▸ render ------------------------------------------------------- */
  return (
    <AdminDashboardClient
      dashboardData={{
        totalUsers:  dash.data?.totalUsers  ?? 0,
        totalMale:   dash.data?.totalMale   ?? 0,
        totalFemale: dash.data?.totalFemale ?? 0,
        logs:        dash.data?.logs        ?? [],
        events:      dash.data?.events      ?? [],
        comments:    dash.data?.comments    ?? [],
        allUsers:    dash.data?.allUsers    ?? [],
        admins:      dash.data?.admins      ?? [],
      }}
    />
  );
}
