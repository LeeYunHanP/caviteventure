// File: app/profilepage/page.tsx
export const runtime = "nodejs";

import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User, { type IUser } from "@/models/User";
import { getUserIdByToken } from "@/lib/auth";
import SignOutButton from "@/components/signout/SignOutButton";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  UserIcon,
  Shield,
  Pencil,
  Building,
  Calendar,
  Mail,
  AtSign,
} from "lucide-react";

export default async function ProfilePage() {
  // 1) Parse session token
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  if (!token) redirect("/signin");

  // 2) Connect & load user
  await dbConnect();
  const userId = await getUserIdByToken(token);
  if (!userId) redirect("/signin");

  const user = (await User.findById(userId).lean()) as IUser | null;
  if (!user) redirect("/signin");

  // 3) Format creation date
  const createdAt = (user as IUser & { createdAt?: string }).createdAt;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  // Fields to render in the info grid
  const infoFields = [
    { Icon: UserIcon, label: "Full Name", value: user.name },
    { Icon: AtSign, label: "Email Address", value: user.email },
    { Icon: MapPin, label: "City", value: user.city },
    { Icon: UserIcon, label: "Gender", value: user.gender },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-[#ece3d5]">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden opacity-5 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,...")`,
            backgroundSize: "1000px 200px",
          }}
        />
      </div>

      <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#654321] flex items-center gap-2">
            <Building className="w-6 h-6 text-[#8B4513]" />
            Zentry Profile
          </h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-[#e6d7c3] overflow-hidden">
              {/* Header gradient */}
              <div className="h-32 bg-gradient-to-r from-[#8B4513] via-[#a67c52] to-[#654321] relative">
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,...")` }}
                />
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center -mt-16 px-6 pb-6">
                {user.profilePicture ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={user.profilePicture}
                      alt={`${user.name}'s profile`}
                      width={128}
                      height={128}
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e6d7c3] to-[#8B4513] border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl text-white font-medium">
                      {user.name?.[0]?.toUpperCase() || "Z"}
                    </span>
                  </div>
                )}

                <h2 className="mt-4 text-2xl font-bold text-[#654321]">
                  {user.name || "Zentry User"}
                </h2>

                <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-[#f5f0e5] text-[#8B4513] border border-[#e6d7c3] text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                  {user.role || "Member"}
                </span>

                <div className="mt-6 space-y-3 text-[#654321]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#8B4513]" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  {user.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#8B4513]" />
                      <span>{user.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#8B4513]" />
                    <span className="text-sm">Member since {formattedDate}</span>
                  </div>
                </div>

                <Link
                  href="/profilepage/edit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#654321] text-white font-medium rounded-lg shadow-sm hover:from-[#654321] hover:to-[#543210] transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-md border border-[#e6d7c3] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e6d7c3]">
                <h3 className="flex items-center gap-2 text-sm font-medium text-[#8B4513] uppercase">
                  <Shield className="w-4 h-4" />
                  Account Status
                </h3>
              </div>
              <div className="p-6 space-y-4 text-[#654321]">
                <div className="flex justify-between">
                  <span>Account Type</span>
                  <span className="px-2.5 py-0.5 bg-[#f5f0e5] border border-[#e6d7c3] rounded text-xs">
                    {user.role === "admin" ? "Administrator" : "User"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Email Verified</span>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-md border border-[#e6d7c3] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e6d7c3]">
                <h3 className="text-xl font-bold text-[#654321]">
                  Profile Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {infoFields.map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-[#f8f5f0] p-5 rounded-xl border border-[#e6d7c3]/50 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-2 text-[#8B4513]">
                        <Icon className="w-4 h-4" />
                        <h3 className="text-sm font-medium">{label}</h3>
                      </div>
                      <p className="text-lg font-medium text-[#654321]">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Bio removed */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
