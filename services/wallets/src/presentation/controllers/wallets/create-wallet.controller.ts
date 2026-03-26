import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateWalletService } from "@services/wallets/create-wallets.service";

@ApiTags("Wallets")
@Controller("wallets")
export class CreateWalletController {
  constructor(private readonly service: CreateWalletService) {}
}
