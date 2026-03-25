import { Round } from "../round";

type BET_STATUS = "PENDING" | "WON" | "LOST" | "CASHED_OUT";

interface BetProps {
  id: string;
  status: BET_STATUS;
  playerId: string;
  amount: bigint;
  cashedOutAt: Date;
  createdAt: Date;
  roundId: string;
  round: Round;
}

export class Bet implements BetProps {
  id: string;
  status: BET_STATUS;
  playerId: string;
  amount: bigint;
  cashedOutAt: Date;
  createdAt: Date;
  roundId: string;
  round: Round;
}
