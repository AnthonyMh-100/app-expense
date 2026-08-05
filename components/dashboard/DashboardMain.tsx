import Link from "next/link";
import clsx from "clsx";
import {
  FiArrowDownLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiClock,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import Avatar from "@/components/daily-cash/Avatar";
import { SectionHeader, StatCard, TableCard } from "@/components/daily-cash/ui";
import type { DashboardMetric, MovementRowData } from "@/components/daily-cash/types";

const METRIC_ICONS = [
  <FiTrendingUp key="gain" className="h-4 w-4" />,
  <FiArrowUpRight key="income" className="h-4 w-4" />,
  <FiTrendingDown key="expense" className="h-4 w-4" />,
  <FiClock key="pending" className="h-4 w-4" />,
];

type DashboardMainProps = {
  metrics: DashboardMetric[];
  movementRows: MovementRowData[];
};

const DashboardMain = ({ metrics, movementRows }: DashboardMainProps) => {
  return (
    <>
      <SectionHeader
        eyebrow="Panel"
        title="Resumen del turno"
        description="Vista compacta para revisar rapidamente la actividad principal y entrar a las tablas."
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <StatCard
            key={metric.title}
            {...metric}
            icon={METRIC_ICONS[index % METRIC_ICONS.length]}
          />
        ))}
      </section>

      <TableCard
        title="Movimientos recientes"
        description="Los ultimos ingresos y gastos registrados en el turno."
        toolbar={
          <Link
            href="/movements"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
          >
            Ver todo
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.22em] text-slate-500">
                <th className="px-3 py-3">Movimiento</th>
                <th className="px-3 py-3">Cliente</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Monto</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movementRows.map((row) => {
                const isIncome = row.typeTone === "success";
                return (
                  <tr
                    key={row.id}
                    className="bg-white transition-colors hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
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
                          <p className="truncate text-sm font-medium text-slate-900">
                            {row.concept}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {row.date} · {row.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" name={row.client} />
                        <span className="text-sm text-slate-700">
                          {row.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                          isIncome
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-rose-200",
                        )}
                      >
                        <span
                          className={clsx(
                            "h-1.5 w-1.5 rounded-full",
                            isIncome ? "bg-emerald-500" : "bg-rose-500",
                          )}
                        />
                        {row.typeLabel}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={clsx(
                          "font-mono text-sm font-medium tabular-nums",
                          isIncome ? "text-emerald-700" : "text-rose-700",
                        )}
                      >
                        {row.amount}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                          row.statusTone === "danger"
                            ? "bg-rose-50 text-rose-700 ring-rose-200"
                            : row.statusTone === "info"
                              ? "bg-sky-50 text-sky-700 ring-sky-200"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-200",
                        )}
                      >
                        <span
                          className={clsx(
                            "h-1.5 w-1.5 rounded-full",
                            row.statusTone === "danger"
                              ? "bg-rose-500"
                              : row.statusTone === "info"
                                ? "bg-sky-500"
                                : "bg-emerald-500",
                          )}
                        />
                        {row.statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TableCard>
    </>
  );
};

export default DashboardMain;
