import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/client";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class createWalletDto {
  @ApiProperty({
    example: "sdjkwejjhsdkmskdhjuedfsndjm...",
    format: "uuid",
    type: "string",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @ApiProperty({
    example: "1000",
    type: Decimal,
    description: "Valor monetário em centavos",
  })
  @IsNotEmpty()
  balance: Decimal;
}
