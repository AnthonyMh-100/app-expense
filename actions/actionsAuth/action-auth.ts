"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import moment from "moment";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

interface LoginResult {
  ok: boolean;
  message: string;
}

export const register = async (
  companyName: string,
  email: string,
  password: string,
): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedCompany = companyName.trim();

  const hashed = await bcrypt.hash(password, 10);
  const token = randomBytes(32).toString("hex");
  const expiresAt = moment().add(30, "days").toDate();

  try {
    const existing = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return { ok: false, message: "Ya existe una cuenta con este correo." };
    }

    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: trimmedCompany,
          email: normalizedEmail,
          password: hashed,
        },
      });
      await tx.session.create({
        data: { token, companyId: company.id, expiresAt },
      });
    });
  } catch {
    return {
      ok: false,
      message: "No se pudo crear la cuenta. Inténtalo de nuevo.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  revalidatePath("/", "layout");
  redirect("/");
};

export const login = async (
  email: string,
  password: string,
  remember = false,
): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return {
      ok: false,
      message: "Ingresa tu correo y contraseña.",
    };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = moment()
    .add(remember ? 30 : 1, "days")
    .toDate();

  try {
    const company = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    });

    if (!company || !company.status) {
      return {
        ok: false,
        message: "Credenciales inválidas.",
      };
    }

    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
      return {
        ok: false,
        message: "Credenciales inválidas.",
      };
    }

    await prisma.session.create({
      data: { token, companyId: company.id, expiresAt },
    });
  } catch {
    return {
      ok: false,
      message: "No se pudo iniciar sesión. Inténtalo de nuevo.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  revalidatePath("/", "layout");
  redirect("/");
};

export const logout = async (): Promise<void> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: moment(0).toDate(),
    });
  }

  revalidatePath("/", "layout");
  redirect("/login");
};
