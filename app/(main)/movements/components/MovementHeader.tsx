"use client";

import {
  DateField,
  SearchField,
  SectionHeader,
  SegmentedFilter,
} from "@/components/daily-cash/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const SEARCH_DEBOUNCE_MS = 400;

type TypeFilterValue = "all" | "income" | "expense";

interface MovementHeaderProps {
  setIsCreateOpen: (value: boolean) => void;
}

const MovementHeader = ({ setIsCreateOpen }: MovementHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const updateFilters = useCallback(
    (filters: {
      q?: string;
      from?: string;
      to?: string;
      type?: TypeFilterValue;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filters.q !== undefined) {
        if (filters.q) params.set("q", filters.q);
        else params.delete("q");
      }

      if (filters.from !== undefined) {
        if (filters.from) params.set("from", filters.from);
        else params.delete("from");
      }

      if (filters.to !== undefined) {
        if (filters.to) params.set("to", filters.to);
        else params.delete("to");
      }

      if (filters.type !== undefined) {
        if (filters.type === "all") params.delete("type");
        else params.set("type", filters.type);
      }

      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (search !== currentQ) {
        updateFilters({ q: search });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateFilters]);

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const type = (searchParams.get("type") as TypeFilterValue) ?? "all";

  return (
    <SectionHeader
      eyebrow="Movimientos"
      title="Historial de movimientos"
      description="Busca rápido, filtra lo necesario y deja que la tabla haga el trabajo principal."
      buttonCreate={
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand-gradient px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Nuevo Movimiento
        </button>
      }
      actions={
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:w-72">
            <SearchField
              placeholder="Buscar por concepto o cliente"
              value={search}
              onChange={setSearch}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateField
              label="Desde"
              value={from}
              onChange={(value) => updateFilters({ from: value })}
            />
            <DateField
              label="Hasta"
              value={to}
              onChange={(value) => updateFilters({ to: value })}
            />
            <SegmentedFilter
              value={type}
              onChange={(value) => updateFilters({ type: value })}
              options={[
                { value: "all", label: "Todos los tipos" },
                { value: "income", label: "Ingresos" },
                { value: "expense", label: "Gastos" },
              ]}
            />
          </div>
        </div>
      }
    />
  );
};

export default MovementHeader;