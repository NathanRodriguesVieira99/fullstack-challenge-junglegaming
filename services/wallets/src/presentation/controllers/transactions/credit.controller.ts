import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller, UseGuards } from "@nestjs/common";

import { JwtGuard } from "../../../infrastructure/auth/jwt/jwt.guard";

import { CreditService } from "../../../application/services/transactions/credit.service";
import type {
  CreditRequestDto,
  CreditResponseDto,
} from "@/presentation/dtos/credit.dto";

@UseGuards(JwtGuard)
@Controller("credit")
export class CreditController {
  constructor(private readonly service: CreditService) {}

  @MessagePattern("credit.transaction")
  credit(@Payload() payload: CreditRequestDto): Promise<CreditResponseDto> {
    return this.service.execute(payload);
  }
}
