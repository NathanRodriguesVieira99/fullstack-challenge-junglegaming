import { MessagePattern, Payload } from "@nestjs/microservices";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";

import { DebitService } from "../../../application/services/transactions/debit.service";
import { DebitRequestDto, DebitResponseDto } from "../../dtos/debit.dto";
import { KAFKA_TOPICS } from "@/constants/kafka";

@ApiTags("debit")
@Controller("debit")
export class DebitController {
  constructor(private readonly service: DebitService) {}

  @MessagePattern(KAFKA_TOPICS.DEBIT_TRANSACTION)
  async debitMessage(
    @Payload() payload: DebitRequestDto,
  ): Promise<DebitResponseDto> {
    return this.service.execute(payload);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBody({ type: DebitRequestDto })
  debit(@Body() body: DebitRequestDto) {
    return this.service.execute(body);
  }
}
