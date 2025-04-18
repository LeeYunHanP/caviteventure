// app/(private)/superadmin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoleNavbar from "@/components/role/RoleNavbar";

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const roleCookie = cookieStore.get("role")?.value || "user";

  if (roleCookie !== "superadmin") {
    redirect("/signin");
  }

  return (
    <html>
      <body>
        <RoleNavbar userRole="superadmin" />
        {children}
      </body>
    </html>
  );
}
