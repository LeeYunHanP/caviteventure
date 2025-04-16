// File: src/lib/cookieUtils.ts
import { parse, serialize } from "cookie";

/**
 * parseCookies:
 *   Parses any cookie header string into an object.
 *   e.g. parseCookies("role=superadmin; sessionToken=abcd123")
 *   => { role: "superadmin", sessionToken: "abcd123" }
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return parse(cookieHeader) as Record<string, string>;
}

/**
 * parseUserRole:
 *   Convenience function to return role from cookie header.
 *   Defaults to "user" if not found.
 */
export function parseUserRole(cookieHeader?: string): string {
  const allCookies = parseCookies(cookieHeader);
  return allCookies.role || "user";
}

/**
 * serializeSessionCookie:
 *   Creates a "sessionToken" cookie with typical security options.
 */
export function serializeSessionCookie(token: string): string {
  return serialize("sessionToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
  });
}

/**
 * serializeRoleCookie:
 *   Creates/updates a "role" cookie with typical security options.
 *   e.g. role = "superadmin" | "admin" | "user"
 */
export function serializeRoleCookie(role: string): string {
  return serialize("role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
  });
}
