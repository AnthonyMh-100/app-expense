"use client";

import {
  createClient,
  updateClient,
  deleteClients,
} from "@/actions/actionsClients/action-clients";
import {
  DeleteRecordModal,
  EditRecordModal,
} from "@/components/daily-cash/modals";
import { alertResult } from "@/components/alerts";

import { ClientForm } from "@/components/modal-client/ClientForm";
import { ClientFormData, validationStrategies } from "@/constants/constants";
import { useMemo, type SetStateAction } from "react";

interface ClientModalsProps {
  clientData: ClientFormData;
  clientInitialData: ClientFormData;
  setClientData: (value: SetStateAction<ClientFormData>) => void;
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  setIsDeleteOpen: (value: boolean) => void;
  setIsCreateOpen: (value: boolean) => void;
}

const hasChanges = (
  current: ClientFormData,
  initial: ClientFormData,
): boolean => {
  return (
    current.name !== initial.name ||
    current.lastName !== initial.lastName ||
    current.email !== initial.email ||
    current.phone !== initial.phone ||
    current.address !== initial.address ||
    current.status !== initial.status
  );
};

const ClientModals = ({
  clientData,
  clientInitialData,
  setClientData,
  isCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  setIsCreateOpen,
}: ClientModalsProps) => {
  const showErrors = useMemo(() => {
    return validationStrategies
      .filter(({ field }) => clientData[field as keyof ClientFormData])
      .map(({ field, validate, message }) => ({
        field,
        value: validate(String(clientData[field as keyof ClientFormData] ?? "")),
        message,
      }))
      .filter((error) => error.value);
  }, [clientData]);

  const isCreateDisabled =
    !clientData.name || !clientData.lastName || showErrors.length > 0;
  const isEditDisabled = !hasChanges(clientData, clientInitialData);

  return (
    <>
      <EditRecordModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Registrar cliente"
        description="Agrega un nuevo cliente a la base visual."
        primaryLabel="Guardar cliente"
        isDisabled={isCreateDisabled}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const clientInfo = await createClient(form);

          if (clientInfo?.ok) {
            await alertResult(clientInfo);
            setIsCreateOpen(false);
          }
        }}
      >
        <ClientForm
          showErrors={showErrors}
          setClientData={setClientData}
          clientData={clientData}
        />
      </EditRecordModal>

      <EditRecordModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar cliente"
        description="Ajusta los datos del cliente seleccionado."
        primaryLabel="Guardar cambios"
        isDisabled={isEditDisabled}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const clientInfo = await updateClient(Number(clientData.id), form);

          if (clientInfo?.ok) {
            await alertResult(clientInfo);
            setIsEditOpen(false);
          }
        }}
      >
        <ClientForm isEdit clientData={clientData} setClientData={setClientData} />
      </EditRecordModal>

      <DeleteRecordModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar cliente"
        description="Confirma la eliminacion del cliente."
        detail="Estas por eliminar este cliente del listado."
        onSubmit={async (e) => {
          e.preventDefault();
          const clientInfo = await deleteClients(Number(clientData.id));

          if (clientInfo?.ok) {
            await alertResult(clientInfo);
            setIsDeleteOpen(false);
          }
        }}
      />
    </>
  );
};

export default ClientModals;
