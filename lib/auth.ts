import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get(
      "mobiskill_session"
    )?.value;

    if (!sessionId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Session error:", error);

    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("mobiskill_session");
}