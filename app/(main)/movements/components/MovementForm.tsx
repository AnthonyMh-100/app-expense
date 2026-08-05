import { inputClassName, PAYMENT_METHODS } from "@/constants/constants";
import { FiAlertCircle } from "react-icons/fi";
import clsx from "clsx";
import { ClientCombobox } from "./ClientCombobox";

export type MovementFormData = {
  concept: string;
  customerId: string;
  amount: string;
  payMethod: string;
  typeMovement: "INCOME" | "EXPENSE";
  observation: string;
};

export const EMPTY_MOVEMENT_FORM: MovementFormData = {
  concept: "",
  customerId: "",
  amount: "",
  payMethod: "CASH",
  typeMovement: "INCOME",
  observation: "",
};

export type MovementValidationError = {
  field: string;
  message: string;
};

type MovementFormProps = {
  form: MovementFormData;
  onChange: (patch: Partial<MovementFormData>) => void;
  showErrors?: MovementValidationError[];
};

const getError = (
  showErrors: MovementValidationError[] | undefined,
  field: string,
) => showErrors?.find((error) => error.field === field)?.message;

export function MovementForm({
  form,
  onChange,
  showErrors = [],
}: MovementFormProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Concepto <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          name="concept"
          placeholder="Ej: Venta mostrador"
          value={form.concept}
          onChange={(e) => onChange({ concept: e.target.value })}
        />
        {getError(showErrors, "concept") && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {getError(showErrors, "concept")}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Cliente <span className="text-red-400">*</span>
        </label>
        <ClientCombobox
          value={form.customerId}
          onChange={(customerId) => onChange({ customerId })}
        />
        {getError(showErrors, "customerId") && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {getError(showErrors, "customerId")}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Monto <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          name="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => onChange({ amount: e.target.value })}
        />
        {getError(showErrors, "amount") && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {getError(showErrors, "amount")}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Método
        </label>
        <select
          className={inputClassName}
          name="payMethod"
          value={form.payMethod}
          onChange={(e) => onChange({ payMethod: e.target.value })}
        >
          {PAYMENT_METHODS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-sm font-medium text-slate-800">
          Tipo de movimiento
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChange({ typeMovement: "INCOME" })}
            className={clsx(
              "cursor-pointer rounded-xl border px-4 py-3 text-left transition",
              form.typeMovement === "INCOME"
                ? "border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white hover:bg-slate-50",
            )}
          >
            <span className="block text-sm font-medium text-slate-900">
              Ingreso
            </span>
            <span className="mt-1 block text-xs text-slate-600">
              Venta o cobro
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ typeMovement: "EXPENSE" })}
            className={clsx(
              "cursor-pointer rounded-xl border px-4 py-3 text-left transition",
              form.typeMovement === "EXPENSE"
                ? "border-rose-300 bg-rose-50"
                : "border-slate-200 bg-white hover:bg-slate-50",
            )}
          >
            <span className="block text-sm font-medium text-slate-900">
              Gasto
            </span>
            <span className="mt-1 block text-xs text-slate-600">
              Pago o salida
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-sm font-medium text-slate-800">
          Observación
        </label>
        <textarea
          className={`${inputClassName} resize-none`}
          rows={3}
          name="observation"
          value={form.observation}
          onChange={(e) => onChange({ observation: e.target.value })}
          placeholder="Nota opcional"
        />
      </div>
    </div>
  );
}