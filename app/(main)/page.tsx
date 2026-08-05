import type { Metadata } from "next";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { getDashboard } from "@/actions/actionsDashboard/action-dashboard";
import { getPageMetadata } from "@/constants/seo";
import { paramString } from "@/utils/search-params";

export const metadata: Metadata = getPageMetadata({
  title: "Panel",
  description:
    "Resumen del turno de la caja diaria: ganancia neta, ingresos, gastos y saldo pendiente.",
  path: "/",
});

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const from = paramString(params, "from");
  const to = paramString(params, "to");

  const dashboard = await getDashboard({ from, to });

  return (
    <div className="p-8">
      <DashboardSummary
        metrics={dashboard?.metrics ?? []}
        movementRows={dashboard?.movementRows ?? []}
      />
    </div>
  );
}