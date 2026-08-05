import type { MovementRowData } from "@/components/daily-cash/types";

export type MovementColumnDef = {
  key: string;
  label: string;
  render?: (data: MovementRowData) => React.ReactNode;
};

export const MOVEMENTS_COLUMNS: MovementColumnDef[] = [
  { key: "movement", label: "Movimiento" },
  { key: "client", label: "Cliente" },
  { key: "date", label: "Fecha" },
  { key: "type", label: "Tipo" },
  { key: "amount", label: "Monto" },
  { key: "status", label: "Estado" },
];
