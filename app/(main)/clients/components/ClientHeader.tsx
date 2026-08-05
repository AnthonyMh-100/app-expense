"use client";

import {
  SearchField,
  SectionHeader,
  StatusFilter,
  type StatusFilterValue,
} from "@/components/daily-cash/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const SEARCH_DEBOUNCE_MS = 400;

const ClientHeader = ({ onOpenCreate }: { onOpenCreate: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const updateFilters = useCallback(
    (filters: { q?: string; status?: StatusFilterValue }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filters.q !== undefined) {
        if (filters.q) params.set("q", filters.q);
        else params.delete("q");
      }

      if (filters.status !== undefined) {
        if (filters.status === "all") params.delete("status");
        else params.set("status", filters.status);
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

  const status = (searchParams.get("status") as StatusFilterValue) ?? "all";

  return (
    <>
      <SectionHeader
        eyebrow="Clientes"
        title="Gestión de clientes"
        buttonCreate={
          <button
            type="button"
            onClick={onOpenCreate}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            <FiPlus className="h-3.5 w-3.5" />
            Registrar cliente
          </button>
        }
        description="Administra los clientes de la imprenta: altas, edición y estado de cuenta."
        actions={
          <div className="w-full flex gap-8 items-center justify-start">
            <SearchField
              placeholder="Buscar por nombre, correo o teléfono"
              value={search}
              onChange={setSearch}
            />
            <StatusFilter
              value={status}
              onChange={(next) => updateFilters({ status: next })}
            />
          </div>
        }
      />
    </>
  );
};

export default ClientHeader;
