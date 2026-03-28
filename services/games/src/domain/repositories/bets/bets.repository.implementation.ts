import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type {
  BetHistoryResponseDto,
  CreateBetRequestDto,
  CreateBetResponseDto,
  PaginationQuery,
  PaginationResult,
} from "@/presentation/dtos/bet.dto";
import type { BetsRepositoryContract } from "./bets.repository.contract";
import { DatabaseService } from "@/infrastructure/database/database.service";
import { Decimal } from "@prisma/client/runtime/client";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

@Injectable()
export class BetsRepositoryImplementation implements BetsRepositoryContract {
  constructor(private readonly db: DatabaseService) {}

  async betsHistory(
    queryParams: PaginationQuery,
    playerId: string,
  ): Promise<PaginationResult<BetHistoryResponseDto>> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = queryParams;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const playerExists = await this.db.bet.findFirst({ where: { playerId } });

    if (!playerExists) throw new NotFoundException("User not found");

    const bets = await this.db.bet.findMany({
      take,
      skip,

      where: { playerId },
      select: {
        id: true,
        amount: true,
        betStatus: true,
        cashedOutAt: false,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!bets) throw new NotFoundException("You have no bets");

    const total_items = await this.db.bet.count();
    const total_pages = Math.ceil(total_items / take);

    return {
      data: bets,
      meta: {
        page,
        limit,
        total_pages,
        total_items,
      },
    };
  }

  async createBet({
    amount,
    betStatus,
    roundStatus,
    roundId,
    playerId,
  }: CreateBetRequestDto): Promise<CreateBetResponseDto> {
    const createBetTransaction = await this.db.$transaction(async () => {
      const playerExists = await this.db.bet.findFirst({
        where: { playerId },
      });

      if (!playerExists) throw new NotFoundException("Player Not Found");

      const roundExists = await this.db.round.findFirst({
        where: { id: roundId },
      });

      if (!roundExists) throw new NotFoundException("Round Not Found");

      const isRoundAvailable = await this.db.round.findFirst({
        where: {
          roundStatus: "FINALIZED",
        },
      });

      const betValue = Decimal(new Decimal(amount));

      if (betValue.lt(1))
        throw new UnauthorizedException("The minimal debit value is 1.00");

      if (betValue.gt(1000))
        throw new UnauthorizedException("The max debit value is 1000.00");

      if (!isRoundAvailable)
        throw new BadRequestException("Round already finished");

      if (roundStatus === "CRASHED") {
        throw new BadRequestException("Bet crashed out!");
      }

      const bet = await this.db.bet.create({
        data: {
          amount,
          roundId,
          playerId,
          betStatus,
        },
        include: {
          round: {
            select: {
              startTime: true,
              endTime: true,
              roundStatus: true,
            },
          },
        },
      });

      return {
        id: bet.id,
        amount: betValue,
        betStatus: bet.betStatus,
        playerId: bet.playerId,
        roundId: bet.roundId,
        createdAt: bet.createdAt,
        status: bet.round.roundStatus,
        startTime: bet.round.startTime,
        endTime: bet.round.endTime,
      };
    });

    return createBetTransaction;
  }
}
