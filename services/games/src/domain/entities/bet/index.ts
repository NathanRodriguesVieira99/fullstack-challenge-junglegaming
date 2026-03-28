import type { BET_STATUS } from "@/infrastructure/database/generated/enums";
import type { Decimal } from "@prisma/client/runtime/client";

interface BetProps {
  id: string;
  betStatus: BET_STATUS;
  playerId: string;
  amount: Decimal;
  cashedOutAt: Date;
  createdAt: Date;
  roundId: string;
}

export class Bet implements BetProps {
  id: string;
  betStatus: BET_STATUS;
  playerId: string;
  amount: Decimal;
  cashedOutAt: Date;
  createdAt: Date;
  roundId: string;
}
