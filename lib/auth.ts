import "server-only";

import moment from "moment";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const SESSION_COOKIE = "session_token";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export const getCurrentCompany = async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { company: true },
  });

  if (!session || session.expiresAt < moment().toDate()) {
    if (session) {
      await prisma.session.delete({ where: { token } });
    }
    return null;
  }

  return session.company;
};