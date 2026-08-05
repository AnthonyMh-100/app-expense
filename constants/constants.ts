import { hasNumbers, isOnlyNumbers, isValidEmail } from "@/utils/utils";

export type ClientData = {
  id?: number;
  name: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: boolean;
};

export type ClientFormData = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
};

export const EMPTY_CLIENT: ClientFormData = {
  id: "",
  name: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  status: true,
};

export type ValidationStrategy = {
  field: keyof ClientData;
  validate: (value: string) => boolean;
  message: string;
};

export const CLIENT_KEYS = {
  NAME: "name",
  LASTNAME: "lastName",
  PHONE: "phone",
  EMAIL: "email",
};

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "TRANSFER", label: "Transferencia" },
];

export const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-300";

export const validationStrategies: ValidationStrategy[] = [
  {
    field: "name",
    validate: hasNumbers,
    message: "El nombre solo debe contener letras.",
  },
  {
    field: "lastName",
    validate: hasNumbers,
    message: "El apellido solo debe contener letras.",
  },
  {
    field: "phone",
    validate: (value) => !isOnlyNumbers(value),
    message: "El teléfono debe contener solo números.",
  },
  {
    field: "email",
    validate: (value) => !isValidEmail(value),
    message: "El email debe tener un formato correcto.",
  },
];
