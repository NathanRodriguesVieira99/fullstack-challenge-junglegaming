import type { Wallet } from "../wallets";

interface PlayerProps {
  id: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  wallet: Wallet;
}

export class Player implements PlayerProps {
  id: string;
  username?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  wallet: Wallet;
}
