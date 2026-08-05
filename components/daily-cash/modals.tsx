"use client";

import type { ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { ModalShell } from "./ui";
import clsx from "clsx";

function ActionRow({
  primaryLabel,
  secondaryLabel = "Cancelar",
  onClose,
  primaryTone = "blue",
  isDisabled,
}: {
  primaryLabel: string;
  secondaryLabel?: string;
  onClose: () => void;
  primaryTone?: "blue" | "rose";
  isDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {secondaryLabel}
      </button>
      <button
        disabled={isDisabled}
        type="submit"
        className={clsx(
          "rounded-lg px-4 py-2.5 text-sm font-medium text-white transition",
          {
            "cursor-not-allowed bg-sky-200": isDisabled,
            "cursor-pointer bg-brand-gradient hover:brightness-110":
              !isDisabled && primaryTone !== "rose",
            "cursor-pointer bg-rose-600 hover:bg-rose-500":
              !isDisabled && primaryTone === "rose",
          },
        )}
      >
        {primaryLabel}
      </button>
    </div>
  );
}

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryLabel: string;
  children: ReactNode;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isDisabled?: boolean;
};

export function EditRecordModal({
  open,
  onClose,
  title,
  description,
  primaryLabel,
  children,
  onSubmit,
  isDisabled = false,
}: EditModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        {children}
        <ActionRow
          isDisabled={isDisabled}
          primaryLabel={primaryLabel}
          onClose={onClose}
        />
      </form>
    </ModalShell>
  );
}

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  detail: string;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

export function DeleteRecordModal({
  open,
  onClose,
  title,
  description,
  detail,
  onSubmit,
}: DeleteModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="md"
      icon={null}
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">{detail}</p>
          </div>
        </div>

        <ActionRow
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          primaryTone="rose"
          onClose={onClose}
        />
      </form>
    </ModalShell>
  );
}
