"use client";

import {
  SearchField,
  SectionHeader,
  SegmentedFilter,
} from "@/components/daily-cash/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const SEARCH_DEBOUNCE_MS = 400;

type AgeFilterValue = "all" | "today" | "old";

const PendingPaymentsHeader = ({ onOpenCreate }: { onOpenCreate: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const updateFilters = useCallback(
    (filters: { q?: string; age?: AgeFilterValue }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filters.q !== undefined) {
        if (filters.q) params.set("q", filters.q);
        else params.delete("q");
      }

      if (filters.age !== undefined) {
        if (filters.age === "all") params.delete("age");
        else params.set("age", filters.age);
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

  const age = (searchParams.get("age") as AgeFilterValue) ?? "all";

  return (
    <SectionHeader
      eyebrow="Cobros pendientes"
      title="Saldos abiertos"
      description="Los saldos que siguen vivos entre dias, con el historial de abonos de cada movimiento."
      buttonCreate={
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand-gradient px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Registrar pago
        </button>
      }
      actions={
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:w-72">
            <SearchField
              placeholder="Buscar por cliente o concepto"
              value={search}
              onChange={setSearch}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedFilter
              value={age}
              onChange={(value) => updateFilters({ age: value })}
              options={[
                { value: "all", label: "Todos" },
                { value: "today", label: "Hoy" },
                { value: "old", label: "Antiguos" },
              ]}
            />
          </div>
        </div>
      }
    />
  );
};

export default PendingPaymentsHeader;