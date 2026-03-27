import { ApiProperty } from "@nestjs/swagger";
import type { Decimal } from "@prisma/client/runtime/client";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class TransactionRequestDto {
  @ApiProperty({
    description: "Unique identifier of the player initiating the transaction",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description: "Unique identifier for this transaction (idempotency key)",
    example: "txn-123e4567-e89b-12d3-a456-426614174002",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: "Unique identifier of the wallet involved in the transaction",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: "Transaction amount in decimal format",
    example: "50.00",
    type: String,
  })
  @IsNumber()
  @IsNotEmpty()
  transactionValue: Decimal;


}

export class TransactionResponseDto {
  @ApiProperty({
    description: "Unique identifier of the transaction record",
    example: "txn-123e4567-e89b-12d3-a456-426614174002",
    type: String,
  })
  transactionId: string;

  @ApiProperty({
    description: "Unique identifier of the player initiating the transaction",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description: "Unique identifier of the wallet",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  walletId: string;

  @ApiProperty({
    description: "Type of transaction (e.g., 'DEBIT', 'CREDIT')",
    example: "DEBIT",
    type: String,
  })
  type: string;

  @ApiProperty({
    description: "Transaction amount",
    example: "50.00",
    type: String,
  })
  transactionValue: Decimal;

  @ApiProperty({
    description: "Timestamp when the transaction was processed",
    example: "2024-01-15T10:30:00.000Z",
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: "Value to be debited from wallet",
    example: 500,
  })
  currentBalance: Decimal;
}
