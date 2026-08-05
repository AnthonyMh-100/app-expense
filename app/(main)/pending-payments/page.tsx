import type { Metadata } from "next";
import PendingPaymentsMain from "./components/PendingPaymentsMain";
import { getPendingPayments } from "@/actions/actionsPayments/action-payments";
import { getPageMetadata } from "@/constants/seo";
import { paramEnum, paramPage, paramString } from "@/utils/search-params";

export const metadata: Metadata = getPageMetadata({
  title: "Cobros pendientes",
  description:
    "Saldos abiertos de clientes y registro de abonos con historial de pagos.",
  path: "/pending-payments",
});

export default async function PendingPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    age?: string;
  }>;
}) {
  const params = await searchParams;
  const page = paramPage(params);
  const search = paramString(params, "q");
  const age = paramEnum(params, "age", ["today", "old"]) ?? "all";

  const pendingData = await getPendingPayments({
    page,
    search,
    age,
    limit: 5,
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <PendingPaymentsMain
          rows={pendingData?.rows ?? []}
          currentPage={page}
          totalPage={pendingData?.total}
          limit={pendingData?.limit}
        />
      </div>
    </div>
  );
}