import type { Decimal } from "@prisma/client/runtime/client";

export type TRANSACTION_TYPE = "CREDIT" | "DEBIT";
export type TRANSACTION_STATUS = "PENDING" | "CONFIRMED" | "FAILED";

interface TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: Decimal;
  createdAt: Date;
  walletId?: string | null;
}

export class Transaction implements TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: Decimal;
  createdAt: Date;
  walletId?: string | null;
}
