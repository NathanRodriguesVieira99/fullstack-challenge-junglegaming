import type { ROUND_STATUS } from "@/infrastructure/database/generated/enums";

interface RoundProps {
  id: string;
  roundStatus: ROUND_STATUS;
  crashPoint: number;
  startTime: Date;
  endTime: Date;
  provablyFairHash: string;
  provablyFairSalt: string;
  provablyFairResult: string;
}

export class Round implements RoundProps {
  id: string;
  roundStatus: ROUND_STATUS;
  crashPoint: number;
  startTime: Date;
  endTime: Date;
  provablyFairHash: string;
  provablyFairSalt: string;
  provablyFairResult: string;
}
