"use client";

import Link from "next/link";
import clsx from "clsx";
import { useCallback } from "react";
import type { ReactNode } from "react";
import {
  FiArrowDownLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiPieChart,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Avatar from "@/components/daily-cash/Avatar";
import type {
  DashboardMetric,
  MovementRowData,
} from "@/components/daily-cash/types";

interface MetricStyle {
  border: string;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
}

const METRIC_STYLES: MetricStyle[] = [
  {
    border: "border-t-4 border-emerald-500",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconColor: "text-white",
    icon: <FiTrendingUp className="h-4 w-4" />,
  },
  {
    border: "border-t-4 border-blue-500",
    iconBg: "bg-gradient-to-br from-sky-400 to-indigo-500",
    iconColor: "text-white",
    icon: <FiBarChart2 className="h-4 w-4" />,
  },
  {
    border: "border-t-4 border-pink-600",
    iconBg: "bg-gradient-to-br from-pink-400 to-fuchsia-600",
    iconColor: "text-white",
    icon: <FiPieChart className="h-4 w-4" />,
  },
  {
    border: "border-t-4 border-amber-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    iconColor: "text-white",
    icon: <FiClock className="h-4 w-4" />,
  },
];

const badgeStyles = {
  emerald: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
} as const;

type BadgeTone = keyof typeof badgeStyles;

interface DashboardSummaryProps {
  metrics: DashboardMetric[];
  movementRows: MovementRowData[];
}

function DateRangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition focus-within:border-slate-300">
      <FiCalendar className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
      />
    </label>
  );
}

const DashboardSummary = ({
  metrics,
  movementRows,
}: DashboardSummaryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("from") ?? "";
  const endDate = searchParams.get("to") ?? "";
  const hasActiveFilter = Boolean(startDate) || Boolean(endDate);

  const updateRange = useCallback(
    (patch: { from?: string; to?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (patch.from !== undefined) {
        if (patch.from) params.set("from", patch.from);
        else params.delete("from");
      }

      if (patch.to !== undefined) {
        if (patch.to) params.set("to", patch.to);
        else params.delete("to");
      }

      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <header className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-gradient"
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-500/30">
              <FiPieChart className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Panel
              </p>
              <h1 className="mb-1 mt-1.5 text-2xl font-bold text-slate-900">
                Resumen del turno
              </h1>
              <p className="text-sm text-slate-500">
                Vista compacta para revisar rápidamente la actividad principal y
                entrar a las tablas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DateRangeField
              label="Desde"
              value={startDate}
              onChange={(value) => updateRange({ from: value })}
            />
            <DateRangeField
              label="Hasta"
              value={endDate}
              onChange={(value) => updateRange({ to: value })}
            />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              >
                <FiX className="h-3.5 w-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.slice(0, 4).map((metric, index) => {
          const style = METRIC_STYLES[index % METRIC_STYLES.length];
          return (
            <article
              key={metric.title}
              className={clsx(
                "relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm",
                style.border,
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs text-slate-500">{metric.title}</p>
                <span
                  className={clsx(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    style.iconBg,
                    style.iconColor,
                  )}
                >
                  {style.icon}
                </span>
              </div>
              <p className="my-2 text-xl font-bold text-slate-900">
                {metric.value}
              </p>
              <p className="text-xs text-slate-400">{metric.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Movimientos recientes
          </h2>
          <Link
            href="/movements"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
          >
            Ver todo <FiArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>

        {movementRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-50 text-slate-300">
              <FiCalendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">
                No hay movimientos en el rango seleccionado
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Ajusta las fechas o limpia los filtros para ver el turno.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="border-b border-slate-100 pb-3 pr-4 pt-1">
                  Movimiento
                </th>
                <th className="border-b border-slate-100 pb-3 pr-4 pt-1">
                  Cliente
                </th>
                <th className="border-b border-slate-100 pb-3 pr-4 pt-1">
                  Tipo
                </th>
                <th className="border-b border-slate-100 pb-3 pr-4 pt-1">
                  Monto
                </th>
                <th className="border-b border-slate-100 pb-3 pt-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {movementRows.map((row) => {
                const isIncome = row.typeTone === "success";
                const badgeTone: BadgeTone =
                  row.statusLabel === "Parcial"
                    ? "amber"
                    : isIncome
                      ? "emerald"
                      : "rose";

                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 odd:bg-white even:bg-slate-50/70 transition-colors hover:bg-slate-100/70 last:border-b-0"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={clsx(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm",
                            isIncome
                              ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                              : "bg-gradient-to-br from-rose-400 to-pink-600",
                          )}
                        >
                          {isIncome ? (
                            <FiArrowUpRight className="h-4 w-4" />
                          ) : (
                            <FiArrowDownLeft className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {row.concept}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {row.date} · {row.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" name={row.client} />
                        <span className="text-sm text-slate-600">
                          {row.client}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={clsx(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                          isIncome ? badgeStyles.emerald : badgeStyles.rose,
                        )}
                      >
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {row.typeLabel}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm font-semibold text-slate-800">
                      {row.amount}
                    </td>
                    <td className="py-4">
                      <span
                        className={clsx(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          badgeStyles[badgeTone],
                        )}
                      >
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {row.statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DashboardSummary;