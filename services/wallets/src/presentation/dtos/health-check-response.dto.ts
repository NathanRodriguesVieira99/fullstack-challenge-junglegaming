import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckResponseDto {
  @ApiProperty({ example: 200 })
  status: string;

  @ApiProperty({ example: "ok" })
  service: string;
}
