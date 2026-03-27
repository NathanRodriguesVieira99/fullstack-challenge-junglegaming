import type { Decimal } from "@prisma/client/runtime/client";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/infrastructure/database/generated/enums";

interface TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  transactionValue: Decimal;
  createdAt: Date;
  walletId?: string | null;
}

export class Transaction implements TransactionProps {
  id: string;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  transactionValue: Decimal;
  createdAt: Date;
  walletId?: string | null;
}
