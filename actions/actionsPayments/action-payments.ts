"use server";

import prisma from "@/lib/prisma";
import { Prisma, $Enums } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/utils/utils";
import moment from "moment";
import type {
  BadgeTone,
  PaymentMethod,
  PaymentRecord,
  PendingPaymentRowData,
} from "@/components/daily-cash/types";

interface GetPendingPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  age?: "all" | "today" | "old";
}

interface PendingPaymentResult {
  ok: boolean;
  message: string;
  errors?: string[];
}

export type PendingPaymentOption = {
  id: number;
  client: string;
  concept: string;
  balance: number;
};

const STATUS_META: Record<
  $Enums.STATUS_MOVEMENT,
  Pick<PendingPaymentRowData, "statusLabel" | "statusTone">
> = {
  PAID: { statusLabel: "Pagado", statusTone: "success" },
  UNPAID: { statusLabel: "Pendiente", statusTone: "warning" },
  PARTIAL: { statusLabel: "Parcial", statusTone: "info" },
};

const PAY_METHODS: $Enums.PAY_METHOD[] = ["CASH", "CARD", "TRANSFER"];

type PendingMovementWithPayments = {
  id: number;
  concept: string;
  amount: Prisma.Decimal;
  status: $Enums.STATUS_MOVEMENT;
  createdAt: Date;
  customerId: number;
  customers: { name: string };
  payments: Array<{
    id: number;
    amount: Prisma.Decimal;
    payMethod: $Enums.PAY_METHOD;
    paymentDate: Date;
    note: string | null;
  }>;
};

const getAgeMeta = (createdAt: Date): {
  ageLabel: string;
  ageTone: BadgeTone;
} => {
  const days = moment()
    .startOf("day")
    .diff(moment(createdAt).startOf("day"), "days");

  if (days <= 0) return { ageLabel: "Hoy", ageTone: "info" };
  if (days <= 2) {
    return { ageLabel: `${days} dia${days === 1 ? "" : "s"}`, ageTone: "warning" };
  }
  return { ageLabel: `${days} dias`, ageTone: "danger" };
};

const toPendingRow = (
  movement: PendingMovementWithPayments,
): PendingPaymentRowData => {
  const total = Number(movement.amount);
  const recorded = movement.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );
  const balance = total - recorded;

  let running = 0;
  const payments: PaymentRecord[] = movement.payments.map((payment) => {
    running += Number(payment.amount);
    return {
      id: payment.id,
      date: moment(payment.paymentDate).format("D MMM").toLowerCase(),
      method: payment.payMethod.toLowerCase() as PaymentMethod,
      note: payment.note ?? undefined,
      amount: formatCurrency(Number(payment.amount)),
      remainingAfter: formatCurrency(total - running),
    };
  });

  const status = STATUS_META[movement.status];
  const age = getAgeMeta(movement.createdAt);

  return {
    id: movement.id,
    client: movement.customers.name,
    concept: movement.concept,
    total: formatCurrency(total),
    collected: formatCurrency(recorded),
    balance: formatCurrency(balance),
    date: moment(movement.createdAt).format("D MMM").toLowerCase(),
    ageLabel: age.ageLabel,
    ageTone: age.ageTone,
    statusLabel: status.statusLabel,
    statusTone: status.statusTone,
    payments,
  };
};

const resolvePendingStatus = (amount: number, collected: number) => {
  if (collected >= amount) return "PAID" as $Enums.STATUS_MOVEMENT;
  if (collected > 0) return "PARTIAL" as $Enums.STATUS_MOVEMENT;
  return "UNPAID" as $Enums.STATUS_MOVEMENT;
};

export const getPendingPayments = async ({
  page = 1,
  limit = 5,
  search = "",
  age = "all",
}: GetPendingPaymentsParams) => {
  try {
    const where: Prisma.MovementWhereInput = {
      companyId: 1,
      typeMovement: "INCOME",
      status: { in: ["UNPAID", "PARTIAL"] },
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
      ...(age === "today" && {
        createdAt: { gte: moment().startOf("day").toDate() },
      }),
      ...(age === "old" && {
        createdAt: { lt: moment().startOf("day").toDate() },
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
          status: true,
          createdAt: true,
          customerId: true,
          customers: { select: { name: true } },
          payments: {
            orderBy: { paymentDate: "asc" },
            select: {
              id: true,
              amount: true,
              payMethod: true,
              paymentDate: true,
              note: true,
            },
          },
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
      rows: rows
        .map(toPendingRow)
        .filter((row) => Number(row.balance.replace(/[^0-9.\-]/g, "")) > 0),
    };
  } catch {
    return {
      ok: false,
      total: 0,
      page: 1,
      limit,
      rows: [] as PendingPaymentRowData[],
    };
  }
};

export const searchPendingPayments = async ({
  search = "",
  limit = 8,
}: {
  search?: string;
  limit?: number;
}): Promise<PendingPaymentOption[]> => {
  try {
    const where: Prisma.MovementWhereInput = {
      companyId: 1,
      typeMovement: "INCOME",
      status: { in: ["UNPAID", "PARTIAL"] },
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
    };

    const rows = await prisma.movement.findMany({
      where,
      select: {
        id: true,
        concept: true,
        amount: true,
        customers: { select: { name: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return rows
      .map((movement) => {
        const collected = movement.payments.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0,
        );
        return {
          id: movement.id,
          client: movement.customers.name,
          concept: movement.concept,
          balance: Number(movement.amount) - collected,
        };
      })
      .filter((option) => option.balance > 0);
  } catch {
    return [];
  }
};

export const registerPayment = async (
  movementId: number,
  formData: FormData,
): Promise<PendingPaymentResult> => {
  const amount = String(formData.get("amount") ?? "").trim();
  const payMethod = String(formData.get("payMethod") ?? "CASH").trim();
  const paymentDate = String(formData.get("paymentDate") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;

  const parsedAmount = Number(amount);
  const errors: string[] = [];
  if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push("Ingrese un monto mayor a cero.");
  }
  if (!PAY_METHODS.includes(payMethod as $Enums.PAY_METHOD)) {
    errors.push("Seleccione un método de pago válido.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors[0], errors };
  }

  try {
    const movement = await prisma.movement.findFirst({
      where: { id: movementId, companyId: 1, typeMovement: "INCOME" },
      select: {
        amount: true,
        payments: { select: { amount: true } },
      },
    });

    if (!movement) {
      return { ok: false, message: "El saldo seleccionado no existe." };
    }

    const collected = movement.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const total = Number(movement.amount);
    const balance = total - collected;

    if (parsedAmount > balance) {
      return { ok: false, message: "El monto supera el saldo pendiente." };
    }

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          movementId,
          companyId: 1,
          amount: new Prisma.Decimal(parsedAmount),
          payMethod: payMethod as $Enums.PAY_METHOD,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          note,
        },
      }),
      prisma.movement.update({
        where: { id: movementId, companyId: 1 },
        data: { status: resolvePendingStatus(total, collected + parsedAmount) },
      }),
    ]);

    revalidatePath("/pending-payments");
    revalidatePath("/");
    return { ok: true, message: "Pago registrado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo registrar el pago. Inténtalo de nuevo.",
    };
  }
};

export const updatePendingPayment = async (
  pendingId: number,
  formData: FormData,
): Promise<PendingPaymentResult> => {
  const concept = String(formData.get("concept") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();

  const parsedAmount = Number(amount);
  const errors: string[] = [];
  if (!concept) errors.push("El concepto es obligatorio.");
  if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push("Ingrese un monto mayor a cero.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors[0], errors };
  }

  try {
    const movement = await prisma.movement.findFirst({
      where: { id: pendingId, companyId: 1, typeMovement: "INCOME" },
      select: { payments: { select: { amount: true } } },
    });

    if (!movement) {
      return { ok: false, message: "El cobro pendiente no existe." };
    }

    const collected = movement.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    if (parsedAmount < collected) {
      return { ok: false, message: "No puede ser menor a lo ya cobrado." };
    }

    await prisma.movement.update({
      where: { id: pendingId, companyId: 1 },
      data: {
        concept,
        amount: new Prisma.Decimal(parsedAmount),
        status: resolvePendingStatus(parsedAmount, collected),
      },
    });

    revalidatePath("/pending-payments");
    revalidatePath("/");
    return { ok: true, message: "Cobro pendiente actualizado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo actualizar el cobro pendiente. Inténtalo de nuevo.",
    };
  }
};

export const deletePendingPayment = async (
  pendingId: number,
): Promise<PendingPaymentResult> => {
  try {
    await prisma.$transaction([
      prisma.payment.deleteMany({
        where: { movementId: pendingId, companyId: 1 },
      }),
      prisma.movement.delete({
        where: { id: pendingId, companyId: 1 },
      }),
    ]);

    revalidatePath("/pending-payments");
    revalidatePath("/");
    return { ok: true, message: "Cobro pendiente eliminado correctamente." };
  } catch {
    return {
      ok: false,
      message: "No se pudo eliminar el cobro pendiente. Inténtalo de nuevo.",
    };
  }
};