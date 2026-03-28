import { Decimal } from "@prisma/client/runtime/client";
import {
  PaginationResult,
  CreateBetResponseDto,
} from "../../../../../../../src/presentation/dtos/bet.dto";

export const paginatedBets: PaginationResult<CreateBetResponseDto> = {
  data: [
    {
      amount: new Decimal(100),
      cashedOutAt: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      betStatus: "WON",
    },
    {
      amount: new Decimal(100),
      cashedOutAt: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      betStatus: "WON",
    },
    {
      amount: new Decimal(100),
      cashedOutAt: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      betStatus: "WON",
    },
    {
      amount: new Decimal(100),
      startTime: new Date(),
      endTime: new Date(),
      betStatus: "LOST",
    },
  ],
  meta: { page: 1, limit: 10, total_items: 5, total_pages: 1 },
};
