// File: src/lib/auth.ts (Node environment usage, do NOT import in the middleware)
import { createSessionInDB, findSessionInDB, deleteSessionInDB } from "./sessionDb";
import { serializeSessionCookie, serializeRoleCookie } from "./cookieUtils";

/**
 * Generate a random hex token using the Web Crypto API.
 * e.g. 30 bytes => 60 hex characters.
 */
function generateToken(lengthInBytes: number): string {
  const randomBytes = new Uint8Array(lengthInBytes);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a session doc in the DB for the userId, returning the random token.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateToken(30);
  await createSessionInDB(userId, token);
  return token;
}

/**
 * For verifying the token -> userId, used in server components or route handlers.
 */
export async function getUserIdByToken(token: string): Promise<string | null> {
  const session = await findSessionInDB(token);
  return session ? session.userId : null;
}

/**
 * For sign-out: remove the session doc from the DB.
 */
export async function destroySession(token: string): Promise<void> {
  await deleteSessionInDB(token);
}

/**
 * Create both session and role cookies at once.
 * 1. Generates a new session token, creates the DB record.
 * 2. Returns an array of two Set-Cookie strings: one for the session, one for the role.
 *
 * Usage example in an API route:
 *   const { sessionCookie, roleCookie } = await createSessionAndRole("12345", "superadmin");
 *   res.setHeader("Set-Cookie", [sessionCookie, roleCookie]);
 */
export async function createSessionAndRole(userId: string, role: string) {
  // 1. Create the session token in the DB
  const sessionToken = await createSession(userId);

  // 2. Build the cookie strings
  const sessionCookie = serializeSessionCookie(sessionToken);
  const roleCookie = serializeRoleCookie(role);

  // Return them in an object, or however you'd like
  return { sessionCookie, roleCookie };
}

/**
 * Export the existing cookie serialization if needed.
 */
export { serializeSessionCookie };
