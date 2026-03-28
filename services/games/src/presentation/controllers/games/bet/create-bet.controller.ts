import { JwtGuard } from "@/infrastructure/auth/jwt/jwt.guard";
import { CreateBetService } from "../../../../application/services/games/bet/create-bet.service";
import { KAFKA_TOPICS } from "../../../../constants/kafka";
import { CreateBetRequestDto } from "../../../dtos/bet.dto";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@Controller("games")
@ApiTags("Bet")
export class CreateBetController {
  constructor(private readonly service: CreateBetService) {}

  @MessagePattern(KAFKA_TOPICS.BET_CREATED)
  async createBetMessage(@Payload() payload: CreateBetRequestDto) {
    return this.service.execute(payload);
  }

  @UseGuards(JwtGuard)
  @Post("bet")
  @HttpCode(HttpStatus.CREATED)
  async bet(@Body() body: CreateBetRequestDto) {
    return this.service.execute(body);
  }

  @Post("bet/cashout")
  async cashout() {}
}
