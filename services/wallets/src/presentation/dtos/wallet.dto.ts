import { ApiProperty } from "@nestjs/swagger";
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
    type: BigInt,
    description: "é BigInt porém vira string após ser sanitizado",
  })
  @IsNotEmpty()
  balance: bigint;
}
