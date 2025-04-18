// File: app/eventapproval/page.tsx

export const runtime = "nodejs"; // Enables Node.js APIs
export const dynamic = "force-dynamic"; // Ensures dynamic rendering

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import User from "@/models/User";
import SuperAdminEventApproval from "./superadmineventapproval";

export default async function EventApprovalPage() {
  try {
    // 1) Connect to the database
    await dbConnect();

    // 2) Retrieve cookies asynchronously
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value || null;

    if (!sessionToken) {
      console.warn("No session token found.");
      redirect("/signin");
    }

    // 3) Convert sessionToken to userId
    const userId = await getUserIdByToken(sessionToken);
    if (!userId) {
      console.warn("Invalid session token or user not found in sessions.");
      redirect("/signin");
    }

    // 4) Fetch the user from the database
    const user = await User.findById(userId).lean();
    if (!user) {
      console.warn("No matching user document in the database.");
      redirect("/signin");
    }

    // 5) Check if the user's role is superadmin
    if (user.role !== "superadmin") {
      console.warn(`User role: ${user.role} (not superadmin).`);
      redirect("/signin");
    }

    // If user is superadmin, render the client component UI
    console.info("User is superadmin. Access granted.");

    return (
      <div>
        {/* Client component for approving events */}
        <SuperAdminEventApproval />
      </div>
    );
  } catch (error) {
    console.error("Error in EventApprovalPage:", error);
    redirect("/signin");
  }
}
