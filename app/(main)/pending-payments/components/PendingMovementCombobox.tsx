"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import clsx from "clsx";
import { inputClassName } from "@/constants/constants";
import { searchPendingPayments } from "@/actions/actionsPayments/action-payments";
import { formatCurrency } from "@/utils/utils";

const SEARCH_DEBOUNCE_MS = 350;
const DEFAULT_LIMIT = 8;

type PendingOption = { id: number; client: string; concept: string; balance: number };

type PendingMovementComboboxProps = {
  value: string;
  onChange: (movementId: string) => void;
};

export function PendingMovementCombobox({ value, onChange }: PendingMovementComboboxProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<PendingOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const result = await searchPendingPayments({ search: query, limit: DEFAULT_LIMIT });
      if (!cancelled) {
        setOptions(result ?? []);
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectOption = (option: PendingOption) => {
    onChange(String(option.id));
    setSelectedLabel(`${option.client} · ${option.concept}`);
    setQuery("");
    setOpen(false);
  };

  const handleChange = (text: string) => {
    setSelectedLabel("");
    setQuery(text);
    setOpen(true);
  };

  const clearSelection = () => {
    onChange("");
    setSelectedLabel("");
    setQuery("");
    setOpen(false);
  };

  const showClear = Boolean(value && selectedLabel);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          className={clsx(inputClassName, "cursor-text pl-9 pr-9")}
          placeholder="Buscar cliente o concepto..."
          value={selectedLabel || query}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        />
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        {showClear ? (
          <button
            type="button"
            onClick={clearSelection}
            aria-label="Quitar saldo seleccionado"
            title="Quitar saldo"
            className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX className="h-4 w-4" />
          </button>
        ) : (
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
      </div>

      {open ? (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {loading ? (
            <p className="px-3 py-2.5 text-sm text-slate-400">Buscando saldos...</p>
          ) : options.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-slate-400">
              {query ? "Sin saldos que coincidan." : "No hay saldos pendientes."}
            </p>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option)}
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition",
                  "hover:bg-slate-50",
                )}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {option.client
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0] ?? "")
                    .join("")
                    .toUpperCase() || "?"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {option.client} · {option.concept}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    Saldo pendiente: {formatCurrency(option.balance)}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}