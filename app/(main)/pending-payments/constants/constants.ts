import type { PendingPaymentRowData } from "@/components/daily-cash/types";

export type PendingColumnDef = {
  key: string;
  label: string;
  render?: (data: PendingPaymentRowData) => React.ReactNode;
};

export const PENDING_COLUMNS: PendingColumnDef[] = [
  { key: "client", label: "Cliente" },
  { key: "age", label: "Antiguedad" },
  { key: "total", label: "Total" },
  { key: "collected", label: "Cobrado" },
  { key: "balance", label: "Saldo" },
  { key: "status", label: "Estado" },
];
