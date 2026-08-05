import type { Metadata } from "next";
import { getClients } from "@/actions/actionsClients/action-clients";
import ClientMain from "./components/ClientMain";
import { getPageMetadata } from "@/constants/seo";
import {
  paramOptionalBoolean,
  paramPage,
  paramString,
} from "@/utils/search-params";

export const metadata: Metadata = getPageMetadata({
  title: "Clientes",
  description:
    "Gestión de clientes de la imprenta: registro, edición, búsqueda y control de estado.",
  path: "/clients",
});

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const page = paramPage(params);
  const search = paramString(params, "q");
  const status = paramOptionalBoolean(params, "status", "active", "inactive");

  const clientsData = await getClients({ page, search, status, limit: 8 });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <ClientMain
          clientsData={clientsData?.data}
          currentPage={page}
          totalPage={clientsData?.total}
          limit={clientsData?.limit}
        />
      </div>
    </div>
  );
}
