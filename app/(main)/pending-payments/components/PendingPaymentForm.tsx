import { inputClassName, PAYMENT_METHODS } from "@/constants/constants";
import { FiAlertCircle, FiChevronDown } from "react-icons/fi";
import { formatCurrency } from "@/utils/utils";
import { PendingMovementCombobox } from "./PendingMovementCombobox";

export type PendingPaymentFormData = {
  movementId: string;
  amount: string;
  payMethod: string;
  paymentDate: string;
  note: string;
};

export const EMPTY_PENDING_PAYMENT_FORM: PendingPaymentFormData = {
  movementId: "",
  amount: "",
  payMethod: "CASH",
  paymentDate: "",
  note: "",
};

export type PendingPaymentValidationError = {
  field: string;
  message: string;
};

type PendingPaymentFormProps = {
  form: PendingPaymentFormData;
  onChange: (patch: Partial<PendingPaymentFormData>) => void;
  maxAmount?: number;
  showErrors?: PendingPaymentValidationError[];
  isAbono?: boolean;
};

const getError = (
  showErrors: PendingPaymentValidationError[] | undefined,
  field: string,
) => showErrors?.find((error) => error.field === field)?.message;

export function PendingPaymentForm({
  form,
  onChange,
  maxAmount,
  showErrors = [],
  isAbono = false,
}: PendingPaymentFormProps) {
  return (
    <div className="space-y-5">
      {!isAbono ? (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Saldo a abonar <span className="text-red-400">*</span>
          </label>
          <PendingMovementCombobox
            value={form.movementId}
            onChange={(movementId) => onChange({ movementId })}
          />
          {getError(showErrors, "movementId") && (
            <p className="flex items-center gap-1 text-xs text-red-400">
              <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {getError(showErrors, "movementId")}
            </p>
          )}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Monto a pagar <span className="text-red-400">*</span>
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
            Metodo
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
            Fecha de pago
          </label>
          <input
            type="date"
            className={inputClassName}
            name="paymentDate"
            value={form.paymentDate}
            onChange={(e) => onChange({ paymentDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">Nota</label>
        <textarea
          className={`${inputClassName} resize-none`}
          rows={3}
          name="note"
          value={form.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="Referencia interna opcional"
        />
        {maxAmount !== undefined ? (
          <p className="text-xs text-slate-500">
            Saldo maximo a pagar: {formatCurrency(maxAmount)}
          </p>
        ) : null}
      </div>
    </div>
  );
}