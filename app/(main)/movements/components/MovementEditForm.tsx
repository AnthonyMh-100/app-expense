import { inputClassName, PAYMENT_METHODS } from "@/constants/constants";
import { FiAlertCircle, FiChevronDown, FiUser } from "react-icons/fi";
import clsx from "clsx";
import type { MovementRowData } from "@/components/daily-cash/types";

export type MovementEditFormData = {
  concept: string;
  amount: string;
  payMethod: string;
  typeMovement: "INCOME" | "EXPENSE";
};

export const EMPTY_MOVEMENT_EDIT_FORM: MovementEditFormData = {
  concept: "",
  amount: "",
  payMethod: "CASH",
  typeMovement: "INCOME",
};

export type MovementValidationError = {
  field: string;
  message: string;
};

type MovementEditFormProps = {
  movement: MovementRowData;
  form: MovementEditFormData;
  onChange: (patch: Partial<MovementEditFormData>) => void;
  showErrors?: MovementValidationError[];
};

const getError = (
  showErrors: MovementValidationError[] | undefined,
  field: string,
) => showErrors?.find((error) => error.field === field)?.message;

export function MovementEditForm({
  movement,
  form,
  onChange,
  showErrors = [],
}: MovementEditFormProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
          <FiUser className="h-4 w-4" />
        </span>
        <div className="grid min-w-0 flex-1 gap-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {movement.client}
          </p>
          <p className="truncate text-xs text-slate-500">
            {movement.date} · {movement.time}
          </p>
        </div>
        <span
          className={clsx(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            movement.statusTone === "success" && "bg-emerald-50 text-emerald-700",
            movement.statusTone === "warning" && "bg-amber-50 text-amber-700",
            movement.statusTone === "info" && "bg-sky-50 text-sky-700",
          )}
        >
          {movement.statusLabel}
        </span>
      </div>

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
            Método <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              className={`${inputClassName} appearance-none pr-9`}
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
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Tipo de movimiento <span className="text-red-400">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange({ typeMovement: "INCOME" })}
              className={clsx(
                "grid cursor-pointer place-items-center gap-0.5 rounded-xl border px-3 py-2.5 transition",
                form.typeMovement === "INCOME"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              )}
            >
              <span className="block text-sm font-medium text-slate-900">
                Ingreso
              </span>
              <span className="block text-xs text-slate-600">
                Venta o cobro
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ typeMovement: "EXPENSE" })}
              className={clsx(
                "grid cursor-pointer place-items-center gap-0.5 rounded-xl border px-3 py-2.5 transition",
                form.typeMovement === "EXPENSE"
                  ? "border-rose-300 bg-rose-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              )}
            >
              <span className="block text-sm font-medium text-slate-900">
                Gasto
              </span>
              <span className="block text-xs text-slate-600">
                Pago o salida
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}