"use client";

import { useMemo, useState } from "react";
import {
  createMovement,
  deleteMovement,
  updateMovement,
} from "@/actions/actionsMovements/action-movements";
import {
  DeleteRecordModal,
  EditRecordModal,
} from "@/components/daily-cash/modals";
import { alertResult } from "@/components/alerts";
import {
  MovementForm,
  EMPTY_MOVEMENT_FORM,
  type MovementFormData,
  type MovementValidationError,
} from "./MovementForm";
import {
  MovementEditForm,
  type MovementEditFormData,
} from "./MovementEditForm";
import type { MovementRowData } from "@/components/daily-cash/types";

interface MovementModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (value: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;
  movementToEdit: MovementRowData | null;
  movementToDelete: MovementRowData | null;
}

const validateField = (
  form: MovementFormData,
  field: keyof MovementFormData,
): MovementValidationError | null => {
  if (field === "concept" && !form.concept.trim()) {
    return { field, message: "El concepto es obligatorio." };
  }

  if (field === "customerId" && !form.customerId) {
    return { field, message: "Seleccione un cliente." };
  }

  if (field === "amount") {
    const value = Number(form.amount);
    if (!form.amount || Number.isNaN(value) || value <= 0) {
      return { field, message: "Ingrese un monto mayor a cero." };
    }
  }

  return null;
};

const buildEditForm = (movement: MovementRowData): MovementEditFormData => ({
  concept: movement.concept,
  amount: movement.amountValue ? String(movement.amountValue) : "",
  payMethod: movement.payMethodValue ?? "CASH",
  typeMovement: movement.typeMovementValue ?? "INCOME",
});

function EditMovementModal({
  movement,
  isOpen,
  onClose,
}: {
  movement: MovementRowData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MovementEditFormData>(() =>
    buildEditForm(movement),
  );
  const [initial] = useState<MovementEditFormData>(() =>
    buildEditForm(movement),
  );

  const editErrors = useMemo(() => {
    const errors: MovementValidationError[] = [];

    if (!form.concept.trim()) {
      errors.push({ field: "concept", message: "El concepto es obligatorio." });
    }

    const amountValue = Number(form.amount);
    if (!form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      errors.push({ field: "amount", message: "Ingrese un monto mayor a cero." });
    }

    return errors;
  }, [form]);

  const hasChanges =
    form.concept !== initial.concept ||
    form.amount !== initial.amount ||
    form.payMethod !== initial.payMethod ||
    form.typeMovement !== initial.typeMovement;

  const isDisabled = editErrors.length > 0 || !hasChanges;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set("concept", form.concept);
    data.set("amount", form.amount);
    data.set("payMethod", form.payMethod);
    data.set("typeMovement", form.typeMovement);

    const result = await updateMovement(movement.id, data);

    if (result.ok) {
      await alertResult(result);
      onClose();
    } else {
      await alertResult(result);
    }
  };

  return (
    <EditRecordModal
      open={isOpen}
      onClose={onClose}
      title="Editar movimiento"
      description="Edita el concepto, monto, método y tipo de movimiento."
      primaryLabel="Guardar cambios"
      isDisabled={isDisabled}
      onSubmit={handleSubmit}
    >
      <MovementEditForm
        movement={movement}
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        showErrors={editErrors}
      />
    </EditRecordModal>
  );
}

const MovementModals = ({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  movementToEdit,
  movementToDelete,
}: MovementModalsProps) => {
  const [form, setForm] = useState<MovementFormData>(EMPTY_MOVEMENT_FORM);
  const [touched, setTouched] = useState<
    Record<keyof MovementFormData, boolean>
  >({
    concept: false,
    customerId: false,
    amount: false,
    payMethod: false,
    typeMovement: false,
    observation: false,
  });

  const handleChange = (patch: Partial<MovementFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.keys(patch).map((key) => [key, true])),
    }));
  };

  const showErrors = useMemo(() => {
    const errors: MovementValidationError[] = [];

    (["concept", "customerId", "amount"] as const).forEach((field) => {
      if (!touched[field]) return;
      const error = validateField(form, field);
      if (error) errors.push(error);
    });

    return errors;
  }, [form, touched]);

  const isCreateDisabled =
    !form.concept.trim() || !form.customerId || showErrors.length > 0;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set("concept", form.concept);
    data.set("customerId", form.customerId);
    data.set("amount", form.amount);
    data.set("payMethod", form.payMethod);
    data.set("typeMovement", form.typeMovement);
    data.set("observation", form.observation);

    const result = await createMovement(data);

    if (result.ok) {
      setForm(EMPTY_MOVEMENT_FORM);
      setTouched({
        concept: false,
        customerId: false,
        amount: false,
        payMethod: false,
        typeMovement: false,
        observation: false,
      });
      setIsCreateOpen(false);
      await alertResult(result);
    } else {
      await alertResult(result);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementToDelete) return;

    const result = await deleteMovement(movementToDelete.id);

    if (result.ok) {
      setIsDeleteOpen(false);
      await alertResult(result);
    } else {
      await alertResult(result);
    }
  };

  return (
    <>
      <EditRecordModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Registrar movimiento"
        description="Los campos con * son obligatorios."
        primaryLabel="Guardar"
        isDisabled={isCreateDisabled}
        onSubmit={handleCreateSubmit}
      >
        <MovementForm
          form={form}
          onChange={handleChange}
          showErrors={showErrors}
        />
      </EditRecordModal>

      {isEditOpen && movementToEdit ? (
        <EditMovementModal
          key={movementToEdit.id}
          movement={movementToEdit}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}

      <DeleteRecordModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar movimiento"
        description="Confirma la eliminación del movimiento."
        detail={`Estás por eliminar el movimiento ${
          movementToDelete ? `«${movementToDelete.concept}»` : ""
        } del historial.`}
        onSubmit={handleDeleteSubmit}
      />
    </>
  );
};

export default MovementModals;