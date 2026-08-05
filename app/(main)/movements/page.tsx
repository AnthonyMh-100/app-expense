import type { Metadata } from "next";
import MovementMain from "./components/MovementMain";
import { getMovements } from "@/actions/actionsMovements/action-movements";
import { getPageMetadata } from "@/constants/seo";
import { paramEnum, paramPage, paramString } from "@/utils/search-params";

export const metadata: Metadata = getPageMetadata({
  title: "Movimientos",
  description:
    "Registro de ingresos y gastos de la caja diaria con búsqueda, filtros por tipo y rango de fechas.",
  path: "/movements",
});

export default async function MovementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    from?: string;
    to?: string;
    type?: string;
  }>;
}) {
  const params = await searchParams;
  const page = paramPage(params);
  const search = paramString(params, "q");
  const from = paramString(params, "from");
  const to = paramString(params, "to");
  const type = paramEnum(params, "type", ["income", "expense"]) ?? "all";

  const movementsData = await getMovements({ page, search, from, to, type });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <MovementMain
          rows={movementsData?.data ?? []}
          currentPage={page}
          totalPage={movementsData?.total}
          limit={movementsData?.limit}
        />
      </div>
    </div>
  );
}