import { Bet } from "../bet";

type ROUND_STATUS = "WAITING" | "RUNNING" | "CRASHED" | "FINALIZED";

interface RoundProps {
  id: string;
  status: ROUND_STATUS;
  crashPoint: number;
  startTime: Date;
  endTime: Date;
  provablyFairHash: string;
  provablyFairSalt: string;
  provablyFairResult: string;
  bets: Bet[];
}

export class Round implements RoundProps {
  id: string;
  status: ROUND_STATUS;
  crashPoint: number;
  startTime: Date;
  endTime: Date;
  provablyFairHash: string;
  provablyFairSalt: string;
  provablyFairResult: string;
  bets: Bet[];
}
