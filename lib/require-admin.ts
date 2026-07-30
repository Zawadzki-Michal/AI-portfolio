import { auth } from "@/auth";

/** Resolves the current session, or null if the caller isn't the signed-in admin. */
export async function requireAdmin() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}
