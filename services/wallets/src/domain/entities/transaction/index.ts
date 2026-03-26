import { Wallet } from "../wallet";

export type TRANSACTION_TYPE = "CREDIT" | "DEBIT";
export type TRANSACTION_STATUS = "PENDING" | "CONFIRMED" | "FAILED";

interface TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: bigint;
  createdAt: Date;
  walletId?: string | null;
}

export class Transaction implements TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: bigint;
  createdAt: Date;
  walletId?: string | null;
}
