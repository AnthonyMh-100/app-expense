"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deletePendingPayment,
  registerPayment,
  updatePendingPayment,
} from "@/actions/actionsPayments/action-payments";
import { DeleteRecordModal, EditRecordModal } from "@/components/daily-cash/modals";
import { alertResult } from "@/components/alerts";
import {
  PendingPaymentForm,
  EMPTY_PENDING_PAYMENT_FORM,
  type PendingPaymentFormData,
  type PendingPaymentValidationError,
} from "./PendingPaymentForm";
import {
  PendingPaymentEditForm,
  type PendingPaymentEditFormData,
  type PendingPaymentEditValidationError,
} from "./PendingPaymentEditForm";
import type { PendingPaymentRowData } from "@/components/daily-cash/types";

const amountToNumber = (value: string): number => {
  const normalized = value.replace(/[^0-9.\-]/g, "").replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

function PaymentModalInner({
  paymentRow,
  onClose,
}: {
  paymentRow: PendingPaymentRowData | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const isAbono = paymentRow !== null;
  const balanceLimit = isAbono
    ? amountToNumber(paymentRow?.balance ?? "0")
    : undefined;

  const [form, setForm] = useState<PendingPaymentFormData>(() => ({
    ...EMPTY_PENDING_PAYMENT_FORM,
    movementId: isAbono && paymentRow ? String(paymentRow.id) : "",
  }));

  const errors = useMemo(() => {
    const errors: PendingPaymentValidationError[] = [];

    if (!isAbono && !form.movementId) {
      errors.push({ field: "movementId", message: "Seleccione un saldo." });
    }

    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      errors.push({ field: "amount", message: "Ingrese un monto mayor a cero." });
    } else if (balanceLimit !== undefined && amount > balanceLimit) {
      errors.push({ field: "amount", message: "El monto supera el saldo pendiente." });
    }

    return errors;
  }, [form, isAbono, balanceLimit]);

  const isDisabled = errors.length > 0 || (!isAbono && !form.movementId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const movementId = isAbono ? paymentRow!.id : Number(form.movementId);

    const data = new FormData();
    data.set("movementId", String(movementId));
    data.set("amount", form.amount);
    data.set("payMethod", form.payMethod);
    data.set("paymentDate", form.paymentDate);
    data.set("note", form.note);

    const result = await registerPayment(movementId, data);

    if (result.ok) {
      onClose();
      await alertResult(result);
      router.refresh();
    } else {
      await alertResult(result);
    }
  };

  return (
    <EditRecordModal
      open
      onClose={onClose}
      title="Registro de pago"
      description={
        isAbono && paymentRow
          ? `Registra un abono contra el saldo «${paymentRow.concept}» de ${paymentRow.client}.`
          : "Registra un pago parcial o total sobre un saldo pendiente."
      }
      primaryLabel="Registrar pago"
      isDisabled={isDisabled}
      onSubmit={handleSubmit}
    >
      <PendingPaymentForm
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        maxAmount={balanceLimit}
        showErrors={errors}
        isAbono={isAbono}
      />
    </EditRecordModal>
  );
}

function EditPaymentModalInner({
  pending,
  onClose,
}: {
  pending: PendingPaymentRowData;
  onClose: () => void;
}) {
  const router = useRouter();
  const collectedAmount = amountToNumber(pending.collected);
  const initial = useMemo<PendingPaymentEditFormData>(
    () => ({
      concept: pending.concept,
      amount: String(amountToNumber(pending.total)),
    }),
    [pending],
  );

  const [form, setForm] = useState<PendingPaymentEditFormData>(initial);

  const errors = useMemo(() => {
    const errors: PendingPaymentEditValidationError[] = [];

    if (!form.concept.trim()) {
      errors.push({ field: "concept", message: "El concepto es obligatorio." });
    }

    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      errors.push({ field: "amount", message: "Ingrese un monto mayor a cero." });
    } else if (amount < collectedAmount) {
      errors.push({
        field: "amount",
        message: "No puede ser menor a lo ya cobrado.",
      });
    }

    return errors;
  }, [form, collectedAmount]);

  const hasChanges =
    form.concept !== initial.concept || form.amount !== initial.amount;

  const isDisabled = errors.length > 0 || !hasChanges;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set("concept", form.concept);
    data.set("amount", form.amount);

    const result = await updatePendingPayment(pending.id, data);

    if (result.ok) {
      onClose();
      await alertResult(result);
      router.refresh();
    } else {
      await alertResult(result);
    }
  };

  return (
    <EditRecordModal
      open
      onClose={onClose}
      title="Editar cobro pendiente"
      description="Ajusta el concepto o el total del saldo seleccionado."
      primaryLabel="Guardar cambios"
      isDisabled={isDisabled}
      onSubmit={handleSubmit}
    >
      <PendingPaymentEditForm
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        minAmount={collectedAmount}
        collectedLabel={pending.collected}
        showErrors={errors}
      />
    </EditRecordModal>
  );
}

type PendingPaymentsModalsProps = {
  isPaymentOpen: boolean;
  paymentRow: PendingPaymentRowData | null;
  isEditOpen: boolean;
  pendingToEdit: PendingPaymentRowData | null;
  isDeleteOpen: boolean;
  pendingToDelete: PendingPaymentRowData | null;
  onClosePayment: () => void;
  setIsEditOpen: (value: boolean) => void;
  setIsDeleteOpen: (value: boolean) => void;
};

const PendingPaymentsModals = ({
  isPaymentOpen,
  paymentRow,
  isEditOpen,
  pendingToEdit,
  isDeleteOpen,
  pendingToDelete,
  onClosePayment,
  setIsEditOpen,
  setIsDeleteOpen,
}: PendingPaymentsModalsProps) => {
  const router = useRouter();

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToDelete) return;

    const result = await deletePendingPayment(pendingToDelete.id);

    if (result.ok) {
      setIsDeleteOpen(false);
      await alertResult(result);
      router.refresh();
    } else {
      await alertResult(result);
    }
  };

  return (
    <>
      {isPaymentOpen ? (
        <PaymentModalInner
          key={paymentRow ? `abono-${paymentRow.id}` : "nuevo"}
          paymentRow={paymentRow}
          onClose={onClosePayment}
        />
      ) : null}

      {isEditOpen && pendingToEdit ? (
        <EditPaymentModalInner
          key={pendingToEdit.id}
          pending={pendingToEdit}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}

      <DeleteRecordModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar cobro pendiente"
        description="Confirma la eliminacion del saldo seleccionado."
        detail={`Estas por eliminar el saldo ${
          pendingToDelete ? `de ${pendingToDelete.client}` : ""
        } junto con sus abonos.`}
        onSubmit={handleDeleteSubmit}
      />
    </>
  );
};

export default PendingPaymentsModals;