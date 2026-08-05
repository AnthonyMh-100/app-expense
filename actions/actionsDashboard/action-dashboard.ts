"use server";

import prisma from "@/lib/prisma";
import { Prisma, $Enums } from "@/app/generated/prisma/client";
import { formatCurrency } from "@/utils/utils";
import moment from "moment";
import type {
  DashboardMetric,
  MovementRowData,
  PaymentMethod,
} from "@/components/daily-cash/types";

interface GetDashboardParams {
  from?: string;
  to?: string;
  limit?: number;
}

type DashboardMovement = {
  id: number;
  concept: string;
  amount: Prisma.Decimal;
  payMethod: $Enums.PAY_METHOD;
  typeMovement: $Enums.TYPE_MOVEMENT;
  status: $Enums.STATUS_MOVEMENT;
  createdAt: Date;
  customers: { name: string };
};

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

const toMovementRow = (movement: DashboardMovement): MovementRowData => {
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
    dateValue: moment(movement.createdAt).format("YYYY-MM-DD"),
    amountValue: Number(movement.amount),
  };
};

export const getDashboard = async ({
  from = "",
  to = "",
  limit = 8,
}: GetDashboardParams = {}) => {
  try {
    const start = from ? moment(from, "YYYY-MM-DD").startOf("day") : moment().startOf("day");
    const end = to ? moment(to, "YYYY-MM-DD").endOf("day") : moment().endOf("day");

    const rangeWhere: Prisma.MovementWhereInput = {
      createdAt: { gte: start.toDate(), lte: end.toDate() },
    };

    const [incomeAgg, expenseAgg, pendingMovements, recentMark, recentRows] =
      await prisma.$transaction([
        prisma.movement.aggregate({
          where: { companyId: 1, typeMovement: "INCOME", ...rangeWhere },
          _sum: { amount: true },
        }),
        prisma.movement.aggregate({
          where: { companyId: 1, typeMovement: "EXPENSE", ...rangeWhere },
          _sum: { amount: true },
        }),
        prisma.movement.findMany({
          where: {
            companyId: 1,
            typeMovement: "INCOME",
            status: { in: ["UNPAID", "PARTIAL"] },
          },
          select: {
            amount: true,
            payments: { select: { amount: true } },
          },
        }),
        prisma.movement.count({ where: { companyId: 1, ...rangeWhere } }),
        prisma.movement.findMany({
          where: { companyId: 1, ...rangeWhere },
          select: {
            id: true,
            concept: true,
            amount: true,
            payMethod: true,
            typeMovement: true,
            status: true,
            createdAt: true,
            customers: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      ]);

    const income = Number(incomeAgg._sum.amount ?? 0);
    const expense = Number(expenseAgg._sum.amount ?? 0);
    const net = income - expense;

    const pendingBalance = pendingMovements.reduce((sum, movement) => {
      const collected = movement.payments.reduce(
        (acc, payment) => acc + Number(payment.amount),
        0,
      );
      return sum + (Number(movement.amount) - collected);
    }, 0);

    const metrics: DashboardMetric[] = [
      {
        title: "Ganancia neta",
        value: formatCurrency(net),
        helper: "Resultado en efectivo del turno activo.",
        tone: "success",
      },
      {
        title: "Ingresos cobrados",
        value: formatCurrency(income),
        helper: "Ingresos registrados en el rango seleccionado.",
        tone: "info",
      },
      {
        title: "Gastos",
        value: formatCurrency(expense),
        helper: "Gastos pagados en el rango seleccionado.",
        tone: "danger",
      },
      {
        title: "Saldo pendiente",
        value: formatCurrency(pendingBalance),
        helper: "Saldos abiertos que continúan entre días.",
        tone: "warning",
      },
    ];

    return {
      ok: true,
      metrics,
      movementRows: recentRows.map(toMovementRow),
      totalMovements: recentMark,
    };
  } catch {
    return {
      ok: false,
      metrics: [] as DashboardMetric[],
      movementRows: [] as MovementRowData[],
      totalMovements: 0,
    };
  }
};