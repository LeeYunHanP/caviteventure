import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User, { type IUser } from "@/models/User";
import { getUserIdByToken } from "@/lib/auth";
import SignOutButton from "@/components/signout/SignOutButton";
import EditableProfileClient from "@/components/profile/EditableProfileClient";
import Link from "next/link";
import { ArrowLeft, Building } from "lucide-react";

export default async function EditProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  if (!token) redirect("/signin");

  await dbConnect();
  const userId = await getUserIdByToken(token);
  if (!userId) redirect("/signin");

  const user = (await User.findById(userId).lean()) as IUser | null;
  if (!user) redirect("/signin");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-[#ece3d5]">
      {/* Decorative buildings background */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden opacity-5 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200' fill='%23654321'%3E…")`,
            backgroundSize: "1000px 200px",
          }}
        ></div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/profilepage"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#e6d7c3] text-[#654321] hover:bg-[#f5f0e5] hover:text-[#8B4513] transition-colors shadow-sm"
              aria-label="Back to profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold text-[#654321] tracking-tight flex items-center">
              <Building className="w-6 h-6 mr-2 text-[#8B4513] hidden sm:inline-block" />
              Edit Profile
            </h1>
          </div>
          <SignOutButton />
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e6d7c3]">
          {/* Profile Header with Gradient */}
          <div className="h-32 bg-gradient-to-r from-[#8B4513] via-[#a67c52] to-[#654321] relative">
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg …%3E")`,
              }}
            ></div>
            <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
              <div
                className="w-full h-full bg-repeat-x"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg …%3E")`,
                  backgroundSize: "1000px 80px",
                  opacity: 0.3,
                }}
              ></div>
            </div>
          </div>

          {/* Edit Form Container */}
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#654321] mb-2">
                  Update Your Profile
                </h2>
              </div>

              <div className="bg-[#f8f5f0] p-6 rounded-xl border border-[#e6d7c3] mb-8">
                <EditableProfileClient
                  initialName={user.name}
                  initialEmail={user.email}
                  initialCity={user.city}
                  initialGender={user.gender}
                  initialProfilePicture={user.profilePicture}
                  cancelButtonText="Cancel and Return to Profile"
                />
              </div>

              <div className="text-sm text-[#8B4513] opacity-80 text-center">
                <p>
                  All changes will be saved automatically when you submit the
                  form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
