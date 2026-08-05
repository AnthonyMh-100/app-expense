"use client";

import { useMemo, useState } from "react";
import MovementHeader from "./MovementHeader";
import MovementModals from "./MovementModals";
import Avatar from "@/components/daily-cash/Avatar";
import { PaginationBar, TableCard } from "@/components/daily-cash/ui";
import {
  FiEdit3,
  FiInbox,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import {
  MOVEMENTS_COLUMNS,
  type MovementColumnDef,
} from "../constants/constants";
import type {
  MovementRowData,
  PaymentMethod,
} from "@/components/daily-cash/types";
import clsx from "clsx";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

type MovementMainProps = {
  rows: MovementRowData[];
  currentPage?: number;
  totalPage?: number;
  limit?: number;
};

const MovementMain = ({ rows, currentPage, totalPage, limit }: MovementMainProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [movementToEdit, setMovementToEdit] =
    useState<MovementRowData | null>(null);
  const [movementToDelete, setMovementToDelete] =
    useState<MovementRowData | null>(null);

  const handleEdit = (movement: MovementRowData) => {
    setMovementToEdit(movement);
    setIsEditOpen(true);
  };

  const handleDelete = (movement: MovementRowData) => {
    setMovementToDelete(movement);
    setIsDeleteOpen(true);
  };

  const formattedColumns: MovementColumnDef[] = useMemo(() => {
    const columns = MOVEMENTS_COLUMNS.map((col) => {
      if (col.key === "movement") {
        return {
          ...col,
          render: (row: MovementRowData) => {
            const isIncome = row.typeTone === "success";
            return (
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    isIncome
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600",
                  )}
                >
                  {isIncome ? (
                    <FiTrendingUp className="h-4 w-4" />
                  ) : (
                    <FiTrendingDown className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {row.concept}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {METHOD_LABELS[row.method]}
                  </p>
                </div>
              </div>
            );
          },
        };
      }

      if (col.key === "client") {
        return {
          ...col,
          render: (row: MovementRowData) => (
            <div className="flex items-center gap-2.5">
              <Avatar size="sm" name={row.client} />
              <span className="text-sm text-slate-600">{row.client}</span>
            </div>
          ),
        };
      }

      if (col.key === "date") {
        return {
          ...col,
          render: (row: MovementRowData) => (
            <div>
              <p className="text-sm font-medium text-slate-800">{row.date}</p>
              <p className="mt-0.5 text-xs text-slate-400">{row.time}</p>
            </div>
          ),
        };
      }

      if (col.key === "type") {
        return {
          ...col,
          render: (row: MovementRowData) => (
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                row.typeTone === "danger"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700",
              )}
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {row.typeLabel}
            </span>
          ),
        };
      }

      if (col.key === "amount") {
        return {
          ...col,
          render: (row: MovementRowData) => (
            <span className="font-mono text-sm font-semibold tabular-nums text-slate-800">
              {row.amount}
            </span>
          ),
        };
      }

      if (col.key === "status") {
        return {
          ...col,
          render: (row: MovementRowData) => (
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                row.statusTone === "danger"
                  ? "bg-rose-50 text-rose-700"
                  : row.statusTone === "info" || row.statusTone === "warning"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700",
              )}
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {row.statusLabel}
            </span>
          ),
        };
      }

      return col;
    });

    return [
      ...columns,
      {
        key: "actions",
        label: "Acciones",
        render: (row: MovementRowData) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleEdit(row)}
              aria-label="Editar movimiento"
              title="Editar movimiento"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <FiEdit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              aria-label="Eliminar movimiento"
              title="Eliminar movimiento"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-transparent text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <>
      <MovementHeader setIsCreateOpen={setIsCreateOpen} />
      <TableCard
        title="Historial de movimientos"
        description="Ingresos y gastos del turno: concepto, cliente, tipo, monto y estado."
        toolbar={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {totalPage ?? 0} movimientos
          </span>
        }
      >
        <div className="space-y-4">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                <FiInbox className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  No hay movimientos
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Registra un nuevo movimiento para comenzar.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {formattedColumns.map(({ key, label }) => (
                        <th
                          key={key}
                          className="border-b border-slate-100 px-5 py-3.5"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 odd:bg-white even:bg-slate-50/70 transition-colors hover:bg-slate-100/70 last:border-b-0"
                      >
                        {formattedColumns.map((column) => (
                          <td
                            key={column.key}
                            className="px-5 py-4 align-middle"
                          >
                            {column.render?.(row)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                currentPage={currentPage}
                totalPage={totalPage}
                limit={limit}
                label="movimientos"
                pathname="/movements"
              />
            </>
          )}
        </div>
      </TableCard>
      <MovementModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        movementToEdit={movementToEdit}
        movementToDelete={movementToDelete}
      />
    </>
  );
};

export default MovementMain;
