import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Decimal } from "@prisma/client/runtime/client";

export class CreateWalletRequestDto {
  @ApiProperty({
    description: "Unique identifier of the player who owns the wallet",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description:
      "Initial wallet balance in decimal format (stored as string for precision)",
    example: "1000.00",
    type: String,
  })
  @IsNotEmpty()
  balance: Decimal;
}

export class CreateWalletResponseDto {
  @ApiProperty({
    description: "Unique identifier of the wallet",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Unique identifier of the player who owns the wallet",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    type: String,
  })
  playerId: string;

  @ApiProperty({
    description: "Current wallet balance in decimal format",
    example: "1000.00",
    type: String,
  })
  balance: Decimal;

  @ApiProperty({
    description: "Timestamp when the wallet was created",
    example: "2024-01-15T10:30:00.000Z",
    type: String,
  })
  createdAt: Date;
}
