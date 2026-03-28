import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Decimal } from "@prisma/client/runtime/client";

export class CreateWalletRequestDto {
  @ApiProperty({
    description: "ID único do jogador que possui a carteira",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description: "Saldo inicial da carteira em formato decimal",
    example: "1000.00",
    type: String,
  })
  @IsNotEmpty()
  balance: Decimal;
}

export class CreateWalletResponseDto {
  @ApiProperty({
    description: "ID único da carteira",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "ID do jogador que possui a carteira",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  playerId: string;

  @ApiProperty({
    description: "Saldo atual da carteira",
    example: "1000.00",
    type: String,
  })
  balance: Decimal;

  @ApiProperty({
    description: "Data e hora de criação da carteira",
    example: "2024-01-15T10:30:00.000Z",
    type: String,
  })
  createdAt: Date;
}
