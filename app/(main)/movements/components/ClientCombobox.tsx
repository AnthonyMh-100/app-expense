"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import clsx from "clsx";
import { inputClassName } from "@/constants/constants";
import { searchClients } from "@/actions/actionsClients/action-clients";
import type { ClientData } from "@/constants/constants";

const SEARCH_DEBOUNCE_MS = 350;
const DEFAULT_LIMIT = 8;

type ClientComboboxProps = {
  value: string;
  onChange: (customerId: string) => void;
};

export function ClientCombobox({ value, onChange }: ClientComboboxProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<ClientData[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const result = await searchClients({ search: query, limit: DEFAULT_LIMIT });
      if (!cancelled) {
        setOptions(result?.data ?? []);
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

  const selectClient = (client: ClientData) => {
    onChange(String(client.id));
    setSelectedName(`${client.name} ${client.lastName ?? ""}`.trim());
    setQuery("");
    setOpen(false);
  };

  const handleChange = (text: string) => {
    setSelectedName("");
    setQuery(text);
    setOpen(true);
  };

  const clearSelection = () => {
    onChange("");
    setSelectedName("");
    setQuery("");
    setOpen(false);
  };

  const showClear = Boolean(value && selectedName);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          className={clsx(inputClassName, "cursor-text pl-9 pr-9")}
          placeholder="Buscar cliente por nombre..."
          value={selectedName || query}
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
            aria-label="Quitar cliente seleccionado"
            title="Quitar cliente"
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
            <p className="px-3 py-2.5 text-sm text-slate-400">Buscando clientes...</p>
          ) : options.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-slate-400">
              {query ? "Sin clientes que coincidan." : "No hay clientes registrados."}
            </p>
          ) : (
            options.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => selectClient(client)}
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition",
                  "hover:bg-slate-50",
                )}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {`${client.name} ${client.lastName ?? ""}`
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0] ?? "")
                    .join("")
                    .toUpperCase() || "?"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {client.name} {client.lastName}
                  </span>
                  {client.email ? (
                    <span className="block truncate text-xs text-slate-400">
                      {client.email}
                    </span>
                  ) : null}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}