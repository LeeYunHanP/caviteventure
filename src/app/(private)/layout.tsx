// File: app/(private)/layout.tsx
import { cookies } from "next/headers";
import RoleNavbar from "@/components/role/RoleNavbar";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const roleCookie = (await cookies()).get("role")?.value || "user";

  return (
    <html>
      <body>
        <RoleNavbar userRole={roleCookie as "user" | "admin" | "superadmin"} />
        {children}
      </body>
    </html>
  );
}
