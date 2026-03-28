import {
  BET_STATUS,
  ROUND_STATUS,
} from "../../infrastructure/database/generated/enums";
import { Decimal } from "@prisma/client/runtime/client";

export type PaginationQuery = {
  page?: number; // página atual
  limit?: number; // limite de dados por página
};

export type PaginationResult<T> = {
  meta: {
    page?: number; // página atual
    limit?: number; // limite atual
    total_items: number; // total de dados
    total_pages: number; // total de páginas
  };
  data: T[]; // T = tipo genérico para o retorno do array de objetos com os dados paginados
};

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BetHistoryResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ enum: BET_STATUS })
  betStatus: BET_STATUS;

  @ApiProperty({ type: Decimal })
  amount: Decimal;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  cashedOutAt?: Date;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date;
}

export class CreateBetRequestDto {
  @ApiProperty({ type: String })
  betId: string;

  @ApiProperty({ type: String })
  playerId: string;

  @ApiProperty({ type: () => Decimal })
  amount: Decimal;

  @ApiProperty({ enum: BET_STATUS })
  betStatus: BET_STATUS;

  @ApiProperty({ enum: ROUND_STATUS })
  roundStatus: ROUND_STATUS;

  @ApiProperty({ type: String })
  roundId: string;
}

export class CreateBetResponseDto {
  @ApiProperty({ type: () => Decimal })
  amount: Decimal;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  cashedOutAt?: Date;

  @ApiProperty({ enum: BET_STATUS })
  betStatus: BET_STATUS;

  @ApiProperty({ type: String, format: "date-time" })
  startTime: Date;

  @ApiProperty({ type: String, format: "date-time" })
  endTime: Date;
}
