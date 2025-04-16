export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User, { type IUser } from "@/models/User";
import { getUserIdByToken } from "@/lib/auth";
import SignOutButton from "@/components/signout/SignOutButton";
import Link from "next/link";
import Image from "next/image";            // ← NEW
import {
  MapPin,
  Pencil,
  Building,
  Calendar,
  Mail,
} from "lucide-react";

export default async function ProfilePage() {
  /* ---------- auth / data fetch ---------- */
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  if (!token) redirect("/signin");

  await dbConnect();
  const userId = await getUserIdByToken(token);
  if (!userId) redirect("/signin");

  const user = (await User.findById(userId).lean()) as IUser | null;
  if (!user) redirect("/signin");

  const createdAt = (user as IUser & { createdAt?: string }).createdAt;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  /* --------------- markup --------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-[#ece3d5]">
      {/* Decorative skyline omitted for brevity … */}

      <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#654321] tracking-tight flex items-center">
            <Building className="w-6 h-6 mr-2 text-[#8B4513]" />
            Zentry Profile
          </h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---------- sidebar ---------- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e6d7c3]">
              {/* cover */}
              <div className="h-32 bg-gradient-to-r from-[#8B4513] via-[#a67c52] to-[#654321] relative" />

              {/* avatar + name */}
              <div className="flex flex-col items-center -mt-16 px-6 pb-6">
                <div className="relative group mb-4">
                  {user.profilePicture ? (
                    /* wrapper must be `relative` for Image `fill` */
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform group-hover:scale-105">
                      <Image
                        src={user.profilePicture}
                        alt="Profile"
                        fill
                        sizes="128px"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    </div>
                  ) : (
                    /* fallback (no picture) */
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#e6d7c3] to-[#8B4513] border-4 border-white shadow-lg flex items-center justify-center transform transition-transform group-hover:scale-105">
                      <span className="text-4xl font-medium text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "Z"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    </div>
                  )}
                </div>

                {/* name + role badge */}
                <h2 className="text-2xl font-bold text-[#654321] text-center">
                  {user.name || "Zentry User"}
                </h2>
                <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f5f0e5] text-[#8B4513] border border-[#e6d7c3]">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                  <span className="capitalize">{user.role || "Member"}</span>
                </span>

                {/* contact / meta */}
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-[#654321]">
                    <Mail className="w-4 h-4 text-[#8B4513]" />
                    <span className="text-sm truncate">
                      {user.email || "No email provided"}
                    </span>
                  </div>

                  {user.city && (
                    <div className="flex items-center gap-3 text-[#654321]">
                      <MapPin className="w-4 h-4 text-[#8B4513]" />
                      <span className="text-sm">{user.city}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[#654321]">
                    <Calendar className="w-4 h-4 text-[#8B4513]" />
                    <span className="text-sm">Member since {formattedDate}</span>
                  </div>
                </div>

                {/* edit button */}
                <Link
                  href="/profilepage/edit"
                  className="w-full mt-6 px-5 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#654321] hover:from-[#654321] hover:to-[#543210] text-white font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Account Status card … (unchanged) */}
          </div>

          {/* ---------- main panel ---------- */}
          <div className="lg:col-span-2">
            {/* profile info card … (unchanged) */}

            {/* recent activity card … (unchanged) */}
          </div>
        </div>
      </main>
    </div>
  );
}
