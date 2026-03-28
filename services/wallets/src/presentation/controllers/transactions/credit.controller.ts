import { MessagePattern, Payload } from "@nestjs/microservices";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { JwtGuard } from "../../../infrastructure/auth/jwt/jwt.guard";

import { CreditService } from "../../../application/services/transactions/credit.service";
import {
  CreditRequestDto,
  CreditResponseDto,
} from "@/presentation/dtos/credit.dto";

@ApiTags("credit")
@UseGuards(JwtGuard)
@Controller("credit")
export class CreditController {
  constructor(private readonly service: CreditService) {}

  @MessagePattern("credit.transaction")
  @ApiBody({ type: CreditRequestDto })
  creditMessage(
    @Payload() payload: CreditRequestDto,
  ): Promise<CreditResponseDto> {
    return this.service.execute(payload);
  }

  @Post()
  @ApiBody({ type: CreditRequestDto })
  credit(@Body() body: CreditRequestDto) {
    return this.service.execute(body);
  }
}
