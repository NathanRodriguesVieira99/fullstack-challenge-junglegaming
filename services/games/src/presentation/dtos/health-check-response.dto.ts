import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckResponseDto {
  @ApiProperty({
    description: "Current health status of the service",
    example: "ok",
    type: String,
  })
  status: string;

  @ApiProperty({
    description: "Name of the service reporting health status",
    example: "games",
    type: String,
  })
  service: string;
}
