"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiClock,
  FiDollarSign,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiRefreshCw,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { logout } from "@/actions/actionsAuth/action-auth";

const navigation = [
  { label: "Panel", href: "/", icon: FiGrid },
  { label: "Movimientos", href: "/movements", icon: FiRefreshCw },
  { label: "Clientes", href: "/clients", icon: FiUsers },
  { label: "Cobros pendientes", href: "/pending-payments", icon: FiClock },
];

const SideBar = ({
  companyName,
  companyEmail,
}: {
  companyName?: string;
  companyEmail?: string;
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const initial = (companyName ?? "N").trim().charAt(0).toUpperCase();

  return (
    <aside
      className={clsx(
        "relative flex h-screen shrink-0 flex-col overflow-hidden border-r border-[#1c2740] bg-sidebar-gradient p-4 text-slate-100 transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(24rem_18rem_at_-10%_-20%,rgb(99_102_241/0.22),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"
      />

      <div
        className={clsx(
          "relative flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.04] p-3 shadow-lg shadow-black/20 backdrop-blur transition-all duration-300",
          isCollapsed && "justify-center p-0",
        )}
      >
        <div
          className={clsx(
            "flex min-w-0 items-center gap-3 transition-all duration-300",
            isCollapsed ? "hidden" : "w-full",
          )}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-900/40 ring-1 ring-white/20">
            <FiDollarSign className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Caja diaria de imprenta
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Caja, entregas y pedidos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={
            isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"
          }
          className={clsx(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white",
            isCollapsed ? "mx-auto" : "",
          )}
        >
          {isCollapsed ? (
            <FiMenu className="h-4 w-4" />
          ) : (
            <FiX className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="relative mt-6 flex-1 space-y-1.5 overflow-y-auto">
        <p
          className={clsx(
            "mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500",
            isCollapsed && "sr-only",
          )}
        >
          Menú
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
              className={clsx(
                "group relative flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition",
                isActive
                  ? "bg-white/[0.08] text-white ring-1 ring-inset ring-white/10"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
                isCollapsed && "justify-center px-0",
              )}
            >
              <span
                aria-hidden
                className={clsx(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                className={clsx(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-indigo-300"
                    : "text-slate-500 group-hover:text-slate-200",
                )}
              />
              <span className={clsx(isCollapsed ? "hidden" : "inline")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-2 space-y-3 border-t border-white/10 pt-4">
        <div
          className={clsx(
            "flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-2.5",
            isCollapsed && "justify-center px-0",
          )}
          title={companyName ?? "Negocio"}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-sm font-bold text-white ring-1 ring-white/20">
            {initial}
          </span>
          {!isCollapsed ? (
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="truncate text-sm font-semibold text-white">
                {companyName}
              </p>
              <p className="truncate text-xs text-slate-400">{companyEmail}</p>
            </div>
          ) : null}
        </div>

        <form action={logout}>
          <button
            type="submit"
            className={clsx(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white",
              isCollapsed && "justify-center px-0",
            )}
            title="Cerrar sesión"
          >
            <span
              className={clsx(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10",
                isCollapsed ? "mx-auto" : "",
              )}
            >
              <FiLogOut className="h-4 w-4" />
            </span>
            <span className={clsx(isCollapsed ? "hidden" : "inline")}>
              Cerrar sesión
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default SideBar;