import clsx from "clsx";
import Link from "next/link";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  pathname: string;
  searchParams: URLSearchParams;
}

const getVisiblePages = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  return [
    1,
    ...(start > 2 ? ["..."] : []),
    ...Array.from({ length: end - start + 1 }, (_, index) => start + index),
    ...(end < totalPages - 1 ? ["..."] : []),
    totalPages,
  ];
};

export function PageNavigator({
  currentPage,
  totalPages,
  pathname,
  searchParams,
}: PageNavigatorProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap  gap-3 rounded-lg  border-slate-200 bg-white px-3 py-2.5">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
        >
          <IoChevronBackOutline className="h-4 w-4" />
          Anterior
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400">
          <IoChevronBackOutline className="h-4 w-4" />
          Anterior
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm font-medium text-slate-500"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(Number(page))}
              className={clsx(
                "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-semibold transition",
                page === currentPage
                  ? "border-transparent bg-brand-gradient text-white shadow-sm shadow-indigo-500/30"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white",
              )}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
        >
          Siguiente
          <IoChevronForwardOutline className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400">
          Siguiente
          <IoChevronForwardOutline className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}
