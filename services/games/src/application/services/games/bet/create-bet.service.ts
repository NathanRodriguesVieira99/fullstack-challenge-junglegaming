import { KAFKA_CLIENTS, KAFKA_TOPICS } from "../../../../constants/kafka";
import { BetsRepositoryContract } from "../../../../domain/repositories/bets/bets.repository.contract";
import {
  CreateBetRequestDto,
  CreateBetResponseDto,
} from "@/presentation/dtos/bet.dto";
import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class CreateBetService {
  constructor(
    @Inject(KAFKA_CLIENTS.PRODUCER) private readonly kafka: ClientKafka,
    private readonly repo: BetsRepositoryContract,
  ) {}

  async execute({
    amount,
    betId,
    playerId,
    roundId,
    roundStatus,
    betStatus,
  }: CreateBetRequestDto): Promise<CreateBetResponseDto> {
    const bet = await this.repo.createBet({
      amount,
      betId,
      playerId,
      roundId,
      roundStatus,
      betStatus,
    });

    this.kafka.emit(KAFKA_TOPICS.BET_CREATED, {
      player: playerId,
      bet: betId,
      round: roundId,
      betValue: amount,
      status: {
        bet: betStatus,
        round: roundStatus,
      },
    });

    return bet;
  }
}
