export interface PlayerProps {
  id: string;
  username?: string | null;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
}

export class Player implements PlayerProps {
  id: string;
  username?: string | null;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
}
