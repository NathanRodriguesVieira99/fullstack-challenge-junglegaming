import type { Player } from "../player";
import type { Transaction } from "../transaction";

interface WalletProps {
  id: string;
  playerId: string;
  balance: bigint;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
  player: Player;
}

export class Wallet implements WalletProps {
  id: string;
  playerId: string;
  balance: bigint;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
  player: Player;
}
