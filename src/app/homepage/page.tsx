import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import ClientGate from "./ClientGate";

export default async function HomePage() {
  // 1) Server-side: grab the session token
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;

  // 2) If no token, bounce to /signin
  if (!token) {
    redirect("/signin");
  }

  // 3) Validate token against DB
  await dbConnect();
  const userId = await getUserIdByToken(token);
  if (!userId) {
    redirect("/signin");
  }

  // 4) Authorized: stream down the container + client gate
  return (
    <div className="min-h-screen bg-[#f5f0e5] relative">
      {/* Top decorative skyline */}
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,40 L25,40 … Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        />
      </div>

      {/* CLIENT UI (with loading + hydration gate) */}
      <ClientGate />

      {/* Bottom decorative skyline (rotated) */}
      <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,0 L25,0 … Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
            transform: "rotate(180deg)",
          }}
        />
      </div>
    </div>
  );
}
