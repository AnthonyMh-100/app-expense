"use client";

import clsx from "clsx";
import { Suspense, type ReactNode } from "react";
import { FiCalendar, FiGrid, FiSearch, FiX } from "react-icons/fi";
import type { BadgeTone, DashboardMetric } from "./types";
import { useSearchParams } from "next/navigation";
import { PageNavigator } from "./PageNavigator";

interface ModalShellProps {
  open: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
  icon?: ReactNode;
}

const badgeStyles: Record<BadgeTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
};

const iconCircleStyles: Record<BadgeTone, string> = {
  success:
    "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm shadow-emerald-500/30",
  danger: "bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-sm shadow-rose-500/30",
  info: "bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-sm shadow-sky-500/30",
  warning:
    "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-500/30",
  neutral: "bg-slate-200 text-slate-600",
};

const topAccentStyles: Record<BadgeTone, string> = {
  success: "bg-gradient-to-r from-emerald-400 to-teal-500",
  danger: "bg-gradient-to-r from-rose-400 to-pink-600",
  info: "bg-gradient-to-r from-sky-400 to-indigo-500",
  warning: "bg-gradient-to-r from-amber-400 to-orange-500",
  neutral: "bg-slate-300",
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  buttonCreate,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  buttonCreate?: ReactNode;
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-gradient"
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/40">
            <FiGrid className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {eyebrow}
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>
        {buttonCreate ? <div className="shrink-0">{buttonCreate}</div> : null}
      </div>

      {actions ? (
        <div className="mt-5 border-t border-slate-100 pt-4">{actions}</div>
      ) : null}
    </div>
  );
}

export function StatCard({
  title,
  value,
  helper,
  tone = "neutral",
  icon,
}: DashboardMetric & { icon?: ReactNode }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={clsx("absolute inset-x-0 top-0 h-1", topAccentStyles[tone])} />
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon ? (
          <span
            className={clsx(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              iconCircleStyles[tone],
            )}
          >
            {icon}
          </span>
        ) : (
          <span
            className={clsx(
              "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
              badgeStyles[tone],
            )}
          >
            {tone}
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </article>
  );
}

export function StatusBadge({
  tone,
  label,
}: {
  tone: BadgeTone;
  label: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        badgeStyles[tone],
      )}
    >
      {label}
    </span>
  );
}

export function TableCard({
  title,
  description,
  toolbar,
  children,
}: {
  title: string;
  description: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-400/60 via-blue-400/50 to-cyan-400/50"
      />
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function SearchField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
      <FiSearch className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

export type StatusFilterValue = "all" | "active" | "inactive";

const statusFilterOptions: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
];

export type SegmentedFilterOption<T extends string = string> = {
  value: T;
  label: string;
};

export function SegmentedFilter<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly SegmentedFilterOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={onChange ? () => onChange(option.value) : undefined}
            className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-brand-gradient text-white shadow-md shadow-indigo-500/25"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatusFilter({
  value = "all",
  onChange,
}: {
  value?: StatusFilterValue;
  onChange?: (value: StatusFilterValue) => void;
}) {
  return (
    <SegmentedFilter
      options={statusFilterOptions}
      value={value}
      onChange={onChange}
    />
  );
}

export function DateField({
  label = "Fecha",
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
      <FiCalendar className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="cursor-pointer border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
      />
    </label>
  );
}

export function SelectField({ options }: { options: string[] }) {
  return (
    <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-none outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function PaginationContent({
  currentPage = 1,
  totalPage = 1,
  limit = 1,
  label = "registros",
  pathname = "/clients",
}: {
  currentPage?: number;
  totalPage?: number;
  limit?: number;
  label?: string;
  pathname?: string;
}) {
  const searchParams = useSearchParams();
  const maxTotalPages = Math.ceil(totalPage / limit);
  const from = totalPage === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalPage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-none">
      <p className="text-sm text-slate-500">
        {totalPage === 0 ? (
          "Sin resultados"
        ) : (
          <>
            Mostrando{" "}
            <span className="font-medium text-slate-900">
              {from}–{to}
            </span>{" "}
            de{" "}
            <span className="font-medium text-slate-900">{totalPage}</span>{" "}
            {label}
          </>
        )}
      </p>
      <PageNavigator
        currentPage={currentPage}
        totalPages={maxTotalPages}
        pathname={pathname}
        searchParams={new URLSearchParams(searchParams)}
      />
    </div>
  );
}

export function PaginationBar({
  currentPage,
  totalPage,
  limit,
  label,
  pathname,
}: {
  currentPage?: number;
  totalPage?: number;
  limit?: number;
  label?: string;
  pathname?: string;
}) {
  return (
    <Suspense fallback={null}>
      <PaginationContent
        currentPage={currentPage}
        totalPage={totalPage}
        limit={limit}
        label={label}
        pathname={pathname}
      />
    </Suspense>
  );
}

export function ModalShell({
  open,
  title = "Registrar cliente",
  description = "Los campos con * son obligatorios.",
  children,
  onClose,
  size = "lg",
  icon,
}: ModalShellProps) {
  if (!open) return null;

  const sizeClass = {
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-[2px]">
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)]",
          sizeClass,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-gradient"
        />
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
          <div className="flex items-start gap-3">
            {icon != null ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-500/25">
                {icon}
              </div>
            ) : null}

            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>

              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Cerrar modal"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
