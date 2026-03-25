import { Wallet } from "../wallets";

type TRANSACTION_TYPE = "CREDIT" | "DEBIT";

type TRANSACTION_STATUS = "PENDING" | "CONFIRMED" | "FAILED";

interface TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: bigint;
  createdAt: Date;
  walletId?: string | null;
  wallet: Wallet;
}

export class Transaction implements TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  amount: bigint;
  createdAt: Date;
  walletId?: string | null;
  wallet: Wallet;
}
