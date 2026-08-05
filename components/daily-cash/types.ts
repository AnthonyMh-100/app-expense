export type BadgeTone = "success" | "danger" | "info" | "warning" | "neutral";

export type MovementKind = "income" | "expense";

export type MovementState = "paid" | "partial" | "pending";

export type PaymentMethod = "cash" | "card" | "transfer";

export type PaymentMethodValue = "CASH" | "CARD" | "TRANSFER";

export type MovementKindValue = "INCOME" | "EXPENSE";

export interface DashboardMetric {
  title: string;
  value: string;
  helper: string;
  tone: BadgeTone;
}

export interface MovementRowData {
  id: number;
  concept: string;
  client: string;
  amount: string;
  date: string;
  time: string;
  typeLabel: string;
  typeTone: BadgeTone;
  statusLabel: string;
  statusTone: BadgeTone;
  method: PaymentMethod;
  dateValue?: string;
  amountValue?: number;
  payMethodValue?: PaymentMethodValue;
  typeMovementValue?: MovementKindValue;
  customerId?: number;
  observation?: string | null;
  createdAt?: string;
  statusValue?: string;
}

export interface PaymentRecord {
  id: number;
  date: string;
  method: PaymentMethod;
  note?: string;
  amount: string;
  remainingAfter: string;
}

export interface PendingPaymentRowData {
  id: number;
  client: string;
  concept: string;
  total: string;
  collected: string;
  balance: string;
  date: string;
  ageLabel: string;
  ageTone: BadgeTone;
  statusLabel: string;
  statusTone: BadgeTone;
  payments: PaymentRecord[];
}

export interface ClientRowData {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  statusLabel: string;
  statusTone: BadgeTone;
}
