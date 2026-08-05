"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiEdit3,
  FiInbox,
  FiPlus,
  FiRepeat,
  FiTrash2,
} from "react-icons/fi";
import Avatar from "@/components/daily-cash/Avatar";
import { PaginationBar, TableCard } from "@/components/daily-cash/ui";
import PendingPaymentsHeader from "./PendingPaymentsHeader";
import PendingPaymentsModals from "./PendingPaymentsModals";
import type {
  BadgeTone,
  PaymentMethod,
  PaymentRecord,
  PendingPaymentRowData,
} from "@/components/daily-cash/types";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

const METHOD_ICONS: Record<
  PaymentMethod,
  React.ComponentType<{ className?: string }>
> = {
  cash: FiDollarSign,
  card: FiCreditCard,
  transfer: FiRepeat,
};

const STATUS_PILL_STYLES: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

const STATUS_DOT_STYLES: Record<BadgeTone, string> = {
  success: "bg-emerald-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
  neutral: "bg-slate-400",
};

function StatusPill({ tone, label }: { tone: BadgeTone; label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_PILL_STYLES[tone],
      )}
    >
      <span
        className={clsx("h-1.5 w-1.5 rounded-full", STATUS_DOT_STYLES[tone])}
      />
      {label}
    </span>
  );
}

function SummaryStat({
  label,
  value,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  tone?: BadgeTone;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-4 py-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {icon ? (
          <span
            className={clsx(
              "shrink-0",
              tone === "success" && "text-emerald-500",
              tone === "danger" && "text-rose-500",
              tone === "neutral" && "text-slate-400",
            )}
          >
            {icon}
          </span>
        ) : null}
        {label}
      </p>
      <p
        className={clsx(
          "mt-2 font-mono text-lg font-semibold tabular-nums",
          tone === "success" && "text-emerald-700",
          tone === "danger" && "text-rose-700",
          tone === "neutral" && "text-slate-950",
        )}
      >
        {value}
      </p>
    </div>
  );
}

const amountToNumber = (value: string): number => {
  const normalized = value.replace(/[^0-9.\-]/g, "").replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

function PaymentHistory({
  payments,
}: {
  payments: PaymentRecord[];
}) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
        <p className="text-sm text-slate-500">
          Sin abonos registrados todavia. Registra el primer pago de este saldo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((payment) => {
        const MethodIcon = METHOD_ICONS[payment.method];
        return (
          <div
            key={payment.id}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">
                {payment.date}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <MethodIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                {METHOD_LABELS[payment.method]}
                {payment.note ? <span>· {payment.note}</span> : null}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-semibold tabular-nums text-slate-950">
                {payment.amount}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Saldo restante {payment.remainingAfter}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PendingPaymentCard({
  row,
  isExpanded,
  onToggle,
  onRegisterAbono,
  onEdit,
  onDelete,
}: {
  row: PendingPaymentRowData;
  isExpanded: boolean;
  onToggle: () => void;
  onRegisterAbono: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const total = amountToNumber(row.total);
  const collected = amountToNumber(row.collected);
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors",
        isExpanded ? "border-slate-200" : "border-slate-200",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50/70 sm:px-5"
      >
        <Avatar name={row.client} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">
              {row.client}
            </p>
            <StatusPill tone={row.statusTone} label={row.statusLabel} />
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {row.concept}
            {row.ageLabel ? (
              <span className="text-slate-400"> · {row.ageLabel}</span>
            ) : null}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Saldo
          </p>
          <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-rose-700">
            {row.balance}
          </p>
        </div>

        <span
          className={clsx(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition",
            isExpanded && "rotate-180 text-sky-700",
          )}
        >
          <FiChevronDown className="h-4 w-4 transition-transform duration-200" />
        </span>
      </button>

      {isExpanded ? (
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 px-4 py-5 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryStat
              icon={<FiDollarSign className="h-3.5 w-3.5" />}
              label="Total"
              value={row.total}
            />
            <SummaryStat
              icon={<FiCheckCircle className="h-3.5 w-3.5" />}
              label="Cobrado"
              value={row.collected}
              tone="success"
            />
            <SummaryStat
              icon={<FiClock className="h-3.5 w-3.5" />}
              label="Saldo"
              value={row.balance}
              tone="danger"
            />
          </div>

          <div className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-slate-600">
                {collected} cobrado de {total}
              </span>
              <span className="font-semibold tabular-nums text-slate-900">
                {percent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">
                Abonos registrados
              </p>
              <span className="text-xs text-slate-500">
                {row.payments.length} pago{row.payments.length === 1 ? "" : "s"}
              </span>
            </div>
            <PaymentHistory payments={row.payments} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <FiEdit3 className="h-3.5 w-3.5" />
                Editar
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </div>

            <button
              type="button"
              onClick={onRegisterAbono}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Registrar abono
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

const PendingPaymentsMain = ({
  rows,
  currentPage,
  totalPage,
  limit,
}: {
  rows: PendingPaymentRowData[];
  currentPage?: number;
  totalPage?: number;
  limit?: number;
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentRow, setPaymentRow] = useState<PendingPaymentRowData | null>(
    null,
  );
  const [pendingToEdit, setPendingToEdit] =
    useState<PendingPaymentRowData | null>(null);
  const [pendingToDelete, setPendingToDelete] =
    useState<PendingPaymentRowData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openPayment = (row: PendingPaymentRowData | null) => {
    setPaymentRow(row);
    setIsPaymentOpen(true);
  };

  const openEdit = (row: PendingPaymentRowData) => {
    setPendingToEdit(row);
    setIsEditOpen(true);
  };

  const openDelete = (row: PendingPaymentRowData) => {
    setPendingToDelete(row);
    setIsDeleteOpen(true);
  };

  const toggleRow = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <PendingPaymentsHeader onOpenCreate={() => openPayment(null)} />

      <TableCard
        title="Cobros pendientes"
        description="Cliente, antiguedad, total cobrado y el saldo que falta por abonar."
        toolbar={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {totalPage ?? 0} saldos
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
                  No hay cobros pendientes
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Registra un pago o cobra un saldo para comenzar.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {rows.map((row) => (
                  <PendingPaymentCard
                    key={row.id}
                    row={row}
                    isExpanded={expandedId === row.id}
                    onToggle={() => toggleRow(row.id)}
                    onRegisterAbono={() => openPayment(row)}
                    onEdit={() => openEdit(row)}
                    onDelete={() => openDelete(row)}
                  />
                ))}
              </div>

              <PaginationBar
                currentPage={currentPage}
                totalPage={totalPage}
                limit={limit}
                label="saldos"
                pathname="/pending-payments"
              />
            </>
          )}
        </div>
      </TableCard>

      <PendingPaymentsModals
        isPaymentOpen={isPaymentOpen}
        paymentRow={paymentRow}
        isEditOpen={isEditOpen}
        pendingToEdit={pendingToEdit}
        isDeleteOpen={isDeleteOpen}
        pendingToDelete={pendingToDelete}
        onClosePayment={() => setIsPaymentOpen(false)}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </>
  );
};

export default PendingPaymentsMain;