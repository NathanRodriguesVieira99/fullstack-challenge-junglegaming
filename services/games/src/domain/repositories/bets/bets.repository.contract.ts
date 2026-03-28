import {
  BetHistoryResponseDto,
  PaginationQuery,
  PaginationResult,
  type CreateBetRequestDto,
  type CreateBetResponseDto,
} from "@/presentation/dtos/bet.dto";

export interface IBetsRepositoryContract {
  betsHistory: (
    queryParams: PaginationQuery,
    playerId: string,
  ) => Promise<PaginationResult<BetHistoryResponseDto>>;
  createBet: (dto: CreateBetRequestDto) => Promise<CreateBetResponseDto>;
}

export abstract class BetsRepositoryContract implements IBetsRepositoryContract {
  betsHistory: (
    queryParams: PaginationQuery,
    playerId: string,
  ) => Promise<PaginationResult<BetHistoryResponseDto>>;
  createBet: (dto: CreateBetRequestDto) => Promise<CreateBetResponseDto>;
}
