import type { Wallet } from "../wallet";

interface PlayerProps {
  id: string;
  username?: string | null;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  wallet: Wallet;
}

export class Player implements PlayerProps {
  id: string;
  username?: string | null;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  wallet: Wallet;
}
