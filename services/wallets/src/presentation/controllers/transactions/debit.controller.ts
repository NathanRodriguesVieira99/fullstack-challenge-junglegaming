import { MessagePattern, Payload } from "@nestjs/microservices";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";

import { DebitService } from "../../../application/services/transactions/debit.service";
import type { DebitRequestDto, DebitResponseDto } from "../../dtos/debit.dto";

@UseGuards(JwtGuard)
@Controller("debit")
export class DebitController {
  constructor(private readonly service: DebitService) {}

  @MessagePattern("debit.transaction")
  async debitMessage(
    @Payload() payload: DebitRequestDto,
  ): Promise<DebitResponseDto> {
    return this.service.execute(payload);
  }

  @Post()
  debit(@Body() body: DebitRequestDto) {
    return this.service.execute(body);
  }
}
