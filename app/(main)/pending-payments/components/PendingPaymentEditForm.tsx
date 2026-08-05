import { inputClassName } from "@/constants/constants";
import { FiAlertCircle } from "react-icons/fi";
import { formatCurrency } from "@/utils/utils";

export type PendingPaymentEditFormData = {
  concept: string;
  amount: string;
};

export type PendingPaymentEditValidationError = {
  field: string;
  message: string;
};

type PendingPaymentEditFormProps = {
  form: PendingPaymentEditFormData;
  onChange: (patch: Partial<PendingPaymentEditFormData>) => void;
  minAmount?: number;
  collectedLabel?: string;
  showErrors?: PendingPaymentEditValidationError[];
};

const getError = (
  showErrors: PendingPaymentEditValidationError[] | undefined,
  field: string,
) => showErrors?.find((error) => error.field === field)?.message;

export function PendingPaymentEditForm({
  form,
  onChange,
  minAmount = 0,
  collectedLabel,
  showErrors = [],
}: PendingPaymentEditFormProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Concepto <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          name="concept"
          placeholder="Ej: Pedido mayorista"
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
          Total <span className="text-red-400">*</span>
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
        {minAmount > 0 ? (
          <p className="text-xs text-slate-500">
            No puede ser menor a lo ya cobrado (
            {collectedLabel ?? formatCurrency(minAmount)})
          </p>
        ) : null}
      </div>
    </div>
  );
}