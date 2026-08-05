"use client";
import { inputClassName } from "@/constants/constants";
import { CLIENT_KEYS } from "@/constants/constants";
import { ClientFormData } from "@/constants/constants";
import { useMemo, type SetStateAction } from "react";
import { FiAlertCircle, FiChevronDown } from "react-icons/fi";

const { NAME, LASTNAME, EMAIL, PHONE } = CLIENT_KEYS;

type ValidationError = {
  field: string;
  value: boolean;
  message: string;
};

export function ClientForm({
  clientData,
  showErrors = [],
  setClientData,
  isEdit,
}: {
  clientData?: ClientFormData;
  isEdit?: boolean;
  showErrors?: Array<ValidationError>;
  setClientData?: (value: SetStateAction<ClientFormData>) => void;
}) {
  const handleFields = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const normalizedValue = name === "status" ? value === "1" : value;
    setClientData?.((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const formatErrors = useMemo<Record<string, ValidationError>>(() => {
    return showErrors.reduce<Record<string, ValidationError>>((acc, error) => {
      const { field } = error;
      acc[field] = error;
      return acc;
    }, {});
  }, [showErrors]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          name="name"
          placeholder="John"
          value={clientData?.name}
          onChange={handleFields}
        />
        {formatErrors[NAME]?.value && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {showErrors[0]?.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Apellido <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          placeholder="Dhoe"
          name="lastName"
          value={clientData?.lastName}
          onChange={handleFields}
        />
        {formatErrors[LASTNAME]?.value && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {showErrors[0]?.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Telefono <span className="text-red-400">*</span>
        </label>
        <input
          className={inputClassName}
          placeholder="Ejem: 987654321"
          name="phone"
          maxLength={9}
          value={clientData?.phone}
          onChange={handleFields}
        />
        {formatErrors[PHONE]?.value && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {showErrors[0]?.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Correo
        </label>
        <input
          name="email"
          className={inputClassName}
          value={clientData?.email}
          onChange={handleFields}
          placeholder="ana@disenosdelnorte.pe"
        />
        <p className="text-xs text-slate-400">
          Opcional, para enviar comprobantes.
        </p>
        {formatErrors[EMAIL]?.value && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {showErrors[0]?.message}
          </p>
        )}
      </div>
      <div className={`space-y-1.5 ${!isEdit ? "md:col-span-2" : ""}`}>
        <label className="block text-sm font-medium text-slate-800">
          Dirección
        </label>
        <textarea
          rows={2}
          value={clientData?.address}
          name="address"
          onChange={handleFields}
          className={`${inputClassName} resize-none`}
          placeholder="Ejem: Lima Av Javier Prado"
        />
      </div>
      {isEdit && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Estado
          </label>
          <div className="relative">
            <select
              onChange={handleFields}
              className={`${inputClassName} appearance-none pr-9`}
              name="status"
              value={clientData?.status ? 1 : 0}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
}
