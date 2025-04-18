import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import SuperAdminDashboardClient from "./SuperAdminDashboardClient";
import User from "@/models/User";

export default async function SuperAdminDashboardPage() {
  // 1) Connect to DB
  await dbConnect();

  // 2) Get session token
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value || null;
  console.log("SuperAdmin Dashboard => sessionToken:", sessionToken);

  if (!sessionToken) {
    console.log("No session token found.");
    redirect("/signin");
  }

  // 3) Convert sessionToken -> userId
  const userId = await getUserIdByToken(sessionToken);
  console.log("SuperAdmin Dashboard => userId from token:", userId);

  if (!userId) {
    console.log("Invalid session token or user not found in sessions.");
    redirect("/signin");
  }

  // 4) Fetch the user from DB
  const user = await User.findById(userId).lean();
  console.log("SuperAdmin Dashboard => DB user:", user);

  if (!user) {
    console.log("No matching user doc in DB.");
    redirect("/signin");
  }

  // 5) Check if role is superadmin
  if (user.role !== "superadmin") {
    console.log(`User role: ${user.role} (not superadmin).`);
    redirect("/signin");
  }

  // Example placeholder data. 
  // Notice we've renamed `events` to `approvedEvents` to match your client code
  const finalData = {
    totalUsers: 100,
    totalMale: 60,
    totalFemale: 40,
    logs: [],
    approvedEvents: [],
    allUsers: [],
    admins: [],
  };

  console.log("User is superadmin. Access granted.");

  return (
    <div>
      
      {/* Pass finalData down as a prop named dashboardData */}
      <SuperAdminDashboardClient dashboardData={finalData} />
    </div>
  );
}
