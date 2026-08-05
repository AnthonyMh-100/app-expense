"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

interface GetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export const searchClients = async ({
  search = "",
  limit = 8,
}: {
  search?: string;
  limit?: number;
}) => {
  try {
    const where: Prisma.CustomerWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const clients = await prisma.customer.findMany({
      where,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return {
      ok: true,
      data: clients,
    };
  } catch {
    return {
      ok: false,
      data: [],
    };
  }
};

export const createClient = async (formClient: FormData) => {
  try {
    const formData = Object.fromEntries(formClient.entries());

    const data: Prisma.CustomerCreateInput = {
      name: String(formData.name ?? ""),
      lastName: String(formData.lastName ?? ""),
      email: String(formData.email ?? ""),
      phone: String(formData.phone ?? ""),
      address: String(formData.address ?? ""),
      status: String(formData.status ?? "0") === "1",
      company: { connect: { id: 1 } },
    };

    await prisma.customer.create({ data });

    revalidatePath("/clients");
    return {
      ok: true,
      message: "Client created Successfully",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const updateClient = async (clientId: number, formClient: FormData) => {
  try {
    const formData = Object.fromEntries(formClient.entries());

    const clientData = Object.entries(formData).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== "") acc[key] = String(value);
        return acc;
      },
      {},
    );

    const { name, lastName, email, phone, address, status } = clientData;

    const data: Prisma.CustomerUpdateInput = {
      ...(name && { name }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(status !== undefined && { status: status === "1" }),
    };

    await prisma.customer.update({
      where: { id: clientId },
      data,
    });

    revalidatePath("/clients");
    return {
      ok: true,
      message: "Client updated Successfully",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const deleteClients = async (clientId: number) => {
  try {
    await prisma.customer.delete({
      where: {
        id: clientId,
        companyId: 1,
      },
    });
    revalidatePath("/clients");

    return {
      ok: true,
      message: "Client deleted Successfully",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const getClients = async ({
  page = 1,
  limit = 5,
  search = "",
  status,
}: GetClientsParams) => {
  try {
    const where: Prisma.CustomerWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
    };

    const clientsData = await prisma.customer.findMany({
      where,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalClients = await prisma.customer.count({ where });

    return {
      ok: true,
      total: totalClients,
      page,
      limit,
      data: clientsData,
    };
  } catch {
    return {
      ok: false,
      data: [],
      message: "Something went wrong. Please try again.",
    };
  }
};
