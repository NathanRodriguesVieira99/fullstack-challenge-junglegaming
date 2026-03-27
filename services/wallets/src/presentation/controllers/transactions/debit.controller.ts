import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller, UseGuards } from "@nestjs/common";

import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";

import { DebitService } from "../../../application/services/transactions/debit.service";
import type { DebitRequestDto, DebitResponseDto } from "../../dtos/debit.dto";

@UseGuards(JwtGuard)
@Controller("debit")
export class DebitController {
  constructor(private readonly service: DebitService) {}

  @MessagePattern("debit.transaction")
  async debit(@Payload() payload: DebitRequestDto): Promise<DebitResponseDto> {
    return this.service.execute(payload);
  }
}
