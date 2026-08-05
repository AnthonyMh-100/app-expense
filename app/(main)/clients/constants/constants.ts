import { ClientData } from "@/constants/constants";

export type ColumnDef = {
  key: string;
  label: string;
  render?: (data: ClientData) => React.ReactNode;
};

export const CLIENTS_COLUMNS: ColumnDef[] = [
  { key: "cliente", label: "Cliente" },
  { key: "phone", label: "Teléfono" },
  { key: "address", label: "Dirección" },
  { key: "status", label: "Estado" },
];
