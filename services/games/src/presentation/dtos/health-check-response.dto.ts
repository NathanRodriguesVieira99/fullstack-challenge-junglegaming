import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckResponseDto {
  @ApiProperty({
    description: "Status atual de saúde do serviço",
    example: "ok",
    type: String,
  })
  status: string;

  @ApiProperty({
    description: "Nome do serviço que está reportando",
    example: "games",
    type: String,
  })
  service: string;
}
