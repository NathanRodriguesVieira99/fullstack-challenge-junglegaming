import type { Decimal } from "@prisma/client/runtime/client";

import { Player } from "../player";
import { Transaction } from "../transaction";

interface WalletProps {
  id: string;
  playerId: string;
  balance: Decimal;
  createdAt: Date;
  updatedAt: Date;
  player: Player | null;
  transactions?: Transaction[];
}

export class Wallet implements WalletProps {
  id: string;
  playerId: string;
  balance: Decimal;
  createdAt: Date;
  updatedAt: Date;
  player: Player | null;
  transactions?: Transaction[];
}
