"use server";

import prisma from "@/lib/prisma";
import { Prisma, $Enums } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/utils/utils";
import moment from "moment";
import type {
  MovementKindValue,
  MovementRowData,
  PaymentMethod,
  PaymentMethodValue,
} from "@/components/daily-cash/types";

interface GetMovementsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "income" | "expense" | "all";
  from?: string;
  to?: string;
}

interface MovementMutationResult {
  ok: boolean;
  message: string;
  errors?: string[];
}

const TYPE_META: Record<
  $Enums.TYPE_MOVEMENT,
  Pick<MovementRowData, "typeLabel" | "typeTone">
> = {
  INCOME: { typeLabel: "Ingreso", typeTone: "success" },
  EXPENSE: { typeLabel: "Gasto", typeTone: "danger" },
};

const STATUS_META: Record<
  $Enums.STATUS_MOVEMENT,
  Pick<MovementRowData, "statusLabel" | "statusTone">
> = {
  PAID: { statusLabel: "Pagado", statusTone: "success" },
  UNPAID: { statusLabel: "Pendiente", statusTone: "warning" },
  PARTIAL: { statusLabel: "Parcial", statusTone: "info" },
};

type MovementWithCustomer = {
  id: number;
  concept: string;
  amount: Prisma.Decimal;
  payMethod: $Enums.PAY_METHOD;
  typeMovement: $Enums.TYPE_MOVEMENT;
  status: $Enums.STATUS_MOVEMENT;
  createdAt: Date;
  observation: string | null;
  customerId: number;
  customers: { name: string };
};

const toMovementRow = (movement: MovementWithCustomer): MovementRowData => {
  const type = TYPE_META[movement.typeMovement];
  const status = STATUS_META[movement.status];

  return {
    id: movement.id,
    concept: movement.concept,
    client: movement.customers.name,
    amount: formatCurrency(Number(movement.amount)),
    date: moment(movement.createdAt).format("D MMM").toLowerCase(),
    time: moment(movement.createdAt).format("HH:mm"),
    method: movement.payMethod.toLowerCase() as PaymentMethod,
    typeLabel: type.typeLabel,
    typeTone: type.typeTone,
    statusLabel: status.statusLabel,
    statusTone: status.statusTone,
    customerId: movement.customerId,
    observation: movement.observation,
    createdAt: movement.createdAt.toISOString(),
    statusValue: movement.status,
    amountValue: Number(movement.amount),
    payMethodValue: movement.payMethod as PaymentMethodValue,
    typeMovementValue: movement.typeMovement as MovementKindValue,
  };
};

export const createMovement = async (
  formData: FormData,
): Promise<MovementMutationResult> => {
  const concept = String(formData.get("concept") ?? "").trim();
  const customerId = Number(formData.get("customerId"));
  const amount = String(formData.get("amount") ?? "").trim();
  const payMethodValue = String(formData.get("payMethod") ?? "CASH").trim();
  const typeMovementValue = String(
    formData.get("typeMovement") ?? "INCOME",
  ).trim();
  const observation = String(formData.get("observation") ?? "").trim() || null;

  const errors: string[] = [];
  if (!concept) errors.push("El concepto es obligatorio.");
  if (!customerId) errors.push("Seleccione un cliente.");
  if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push("Ingrese un monto mayor a cero.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors[0], errors };
  }

  try {
    await prisma.movement.create({
      data: {
        concept,
        customerId,
        companyId: 1,
        amount: new Prisma.Decimal(amount),
        payMethod: payMethodValue as $Enums.PAY_METHOD,
        typeMovement: typeMovementValue as $Enums.TYPE_MOVEMENT,
        status: "UNPAID",
        observation,
      },
    });

    revalidatePath("/movements");
    return { ok: true, message: "Movimiento registrado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo registrar el movimiento. Inténtalo de nuevo.",
    };
  }
};

export const getMovements = async ({
  page = 1,
  limit = 8,
  search = "",
  type = "all",
  from = "",
  to = "",
}: GetMovementsParams) => {
  try {
    const where: Prisma.MovementWhereInput = {
      companyId: 1,
      ...(search && {
        OR: [
          { concept: { contains: search, mode: "insensitive" } },
          {
            customers: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }),
      ...(type !== "all" && {
        typeMovement: type === "income" ? "INCOME" : "EXPENSE",
      }),
      ...(from && {
        createdAt: {
          gte: moment(from, "YYYY-MM-DD").startOf("day").toDate(),
        },
      }),
      ...(to && {
        createdAt: {
          lte: moment(to, "YYYY-MM-DD").endOf("day").toDate(),
        },
      }),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.movement.count({ where }),
      prisma.movement.findMany({
        where,
        select: {
          id: true,
          concept: true,
          amount: true,
          payMethod: true,
          typeMovement: true,
          status: true,
          createdAt: true,
          observation: true,
          customerId: true,
          customers: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      ok: true,
      total,
      page,
      limit,
      data: rows.map(toMovementRow),
    };
  } catch {
    return { ok: false, total: 0, page: 1, limit, data: [] as MovementRowData[] };
  }
};

export const updateMovement = async (
  movementId: number,
  formData: FormData,
): Promise<MovementMutationResult> => {
  const concept = String(formData.get("concept") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const payMethodValue = String(formData.get("payMethod") ?? "CASH").trim();
  const typeMovementValue = String(
    formData.get("typeMovement") ?? "INCOME",
  ).trim();

  const errors: string[] = [];
  if (!concept) errors.push("El concepto es obligatorio.");
  if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push("Ingrese un monto mayor a cero.");
  }
  if (!TYPE_META[typeMovementValue as $Enums.TYPE_MOVEMENT]) {
    errors.push("Seleccione un tipo de movimiento válido.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors[0], errors };
  }

  try {
    await prisma.movement.update({
      where: {
        id: movementId,
        companyId: 1,
      },
      data: {
        concept,
        amount: new Prisma.Decimal(amount),
        payMethod: payMethodValue as $Enums.PAY_METHOD,
        typeMovement: typeMovementValue as $Enums.TYPE_MOVEMENT,
      },
    });

    revalidatePath("/movements");
    return { ok: true, message: "Movimiento actualizado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo actualizar el movimiento. Inténtalo de nuevo.",
    };
  }
};

export const deleteMovement = async (
  movementId: number,
): Promise<MovementMutationResult> => {
  try {
    await prisma.movement.delete({
      where: {
        id: movementId,
        companyId: 1,
      },
    });

    revalidatePath("/movements");
    return { ok: true, message: "Movimiento eliminado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo eliminar el movimiento. Inténtalo de nuevo.",
    };
  }
};