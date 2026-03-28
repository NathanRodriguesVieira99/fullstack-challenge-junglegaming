import { ApiProperty } from "@nestjs/swagger";
import type { Decimal } from "@prisma/client/runtime/client";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreditRequestDto {
  @ApiProperty({
    description: "ID único do jogador",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description: "ID único da transação (chave de idempotência)",
    example: "txn-123e4567-e89b-12d3-a456-426614174002",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: "ID da carteira do jogador",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: "Valor do crédito",
    example: "50.00",
    type: String,
  })
  @IsNumber()
  @IsNotEmpty()
  transactionValue: Decimal;
}

export class CreditResponseDto {
  @ApiProperty({
    description: "ID único da transação",
    example: "txn-123e4567-e89b-12d3-a456-426614174002",
    type: String,
  })
  transactionId: string;

  @ApiProperty({
    description: "ID do jogador que iniciou a transação",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description: "ID da carteira",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  walletId: string;

  @ApiProperty({
    description: "Tipo de transação (ex: 'DEBIT', 'CREDIT')",
    example: "CREDIT",
    type: String,
  })
  type: string;

  @ApiProperty({
    description: "Valor da transação",
    example: "50.00",
    type: String,
  })
  transactionValue: Decimal;

  @ApiProperty({
    description: "Data e hora em que a transação foi processada",
    example: "2024-01-15T10:30:00.000Z",
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: "Saldo atual da carteira após o crédito",
    example: 500,
  })
  currentBalance: Decimal;
}
