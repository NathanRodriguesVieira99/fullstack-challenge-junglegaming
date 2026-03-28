import { Controller, Get } from "@nestjs/common";
import { HealthCheckResponseDto } from "../../dtos/health-check-response.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get("health")
  @ApiOperation({ summary: "Verifica a saúde do serviço", operationId: "healthCheck" })
  @ApiResponse({ type: HealthCheckResponseDto, status: 200 })
  @Get("health")
  check(): HealthCheckResponseDto {
    return {
      status: "ok",
      service: "wallets",
    };
  }
}
