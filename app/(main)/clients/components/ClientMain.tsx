"use client";

import React, { useCallback, useMemo, useState } from "react";
import ClientModals from "./ClientModals";
import ClientHeader from "./ClientHeader";
import Avatar from "@/components/daily-cash/Avatar";
import { PaginationBar, TableCard } from "@/components/daily-cash/ui";
import { FiEdit3, FiTrash2, FiUsers } from "react-icons/fi";
import { CLIENTS_COLUMNS, ColumnDef } from "../constants/constants";
import {
  ClientData,
  ClientFormData,
  EMPTY_CLIENT,
} from "@/constants/constants";
import clsx from "clsx";

type ClientMainProps = {
  clientsData: ClientData[];
  currentPage?: number;
  totalPage?: number;
  limit?: number;
};

const ClientMain = ({
  clientsData,
  currentPage,
  totalPage,
  limit,
}: ClientMainProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientFormData>(EMPTY_CLIENT);
  const [clientInitialData, setClientInitialData] =
    useState<ClientFormData>(EMPTY_CLIENT);

  const handleOpenCreate = () => {
    setClientData(EMPTY_CLIENT);
    setClientInitialData(EMPTY_CLIENT);
    setIsCreateOpen(true);
  };

  const handleEdit = useCallback((data: ClientData) => {
    const snapshot: ClientFormData = {
      id: String(data.id),
      name: data.name ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      status: data.status,
    };
    setClientData(snapshot);
    setClientInitialData(snapshot);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((data: ClientData) => {
    setClientData((prev) => ({ ...prev, id: String(data.id) }));
    setIsDeleteOpen(true);
  }, []);

  const formattedColumns: ColumnDef[] = useMemo(() => {
    const clientsColumns = CLIENTS_COLUMNS.map((col) => {
      if (col.key === "cliente") {
        return {
          ...col,
          render: (data: ClientData) => {
            return (
              <div className="flex items-center gap-3">
                <Avatar
                  name={data.name ?? ""}
                  lastname={data.lastName ?? ""}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {data.name} {data.lastName}
                  </p>
                  {data.email ? (
                    <p className="truncate text-xs text-slate-400">
                      {data.email}
                    </p>
                  ) : (
                    <p className="truncate text-xs italic text-slate-300">
                      Sin correo
                    </p>
                  )}
                </div>
              </div>
            );
          },
        };
      }

      if (col.key === "address") {
        return {
          ...col,
          render: (data: ClientData) =>
            data.address ? (
              <span
                className="block max-w-56 truncate text-sm text-slate-600"
                title={data.address}
              >
                {data.address}
              </span>
            ) : (
              <span className="italic text-slate-300">—</span>
            ),
        };
      }

      if (col.key === "status") {
        return {
          ...col,
          render: ({ status }: ClientData) => (
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                status
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              <span
                className={clsx(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                  status ? "bg-current" : "bg-slate-400",
                )}
              />
              {status ? "Activo" : "Inactivo"}
            </span>
          ),
        };
      }

      return col;
    });

    return [
      ...clientsColumns,
      {
        key: "actions",
        label: "Acciones",
        render: (data: ClientData) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleEdit(data)}
              aria-label={`Editar ${data.name} ${data.lastName ?? ""}`}
              title="Editar cliente"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <FiEdit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(data)}
              aria-label={`Eliminar ${data.name} ${data.lastName ?? ""}`}
              title="Eliminar cliente"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-transparent text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ];
  }, [handleEdit, handleDelete]);

  return (
    <>
      <ClientHeader onOpenCreate={handleOpenCreate} />
      <TableCard
        title="Listado de clientes"
        description="Administra los clientes registrados: estado y datos de contacto."
        toolbar={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {totalPage ?? 0} clientes
          </span>
        }
      >
        <div className="space-y-4">
          {clientsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                <FiUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  No se encontraron clientes
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Ajusta la búsqueda o el filtro, o registra un nuevo cliente.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {formattedColumns.map(({ key, label }) => (
                        <th key={key} className="border-b border-slate-100 px-5 py-3.5">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientsData.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-slate-100 odd:bg-white even:bg-slate-50/70 transition-colors hover:bg-slate-100/70 last:border-b-0"
                      >
                        {formattedColumns.map((column) => (
                          <td
                            key={column.key}
                            className="px-5 py-4 align-middle text-sm text-slate-700"
                          >
                            {column.render
                              ? column.render(client)
                              : client[column.key as keyof ClientData] || (
                                  <span className="italic text-slate-300">
                                    —
                                  </span>
                                )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                currentPage={currentPage}
                totalPage={totalPage}
                limit={limit}
                label="clientes"
              />
            </>
          )}
        </div>
      </TableCard>
      <ClientModals
        clientData={clientData}
        clientInitialData={clientInitialData}
        setClientData={setClientData}
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setIsCreateOpen={setIsCreateOpen}
      />
    </>
  );
};

export default ClientMain;
