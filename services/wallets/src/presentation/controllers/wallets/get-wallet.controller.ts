import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetWalletService } from "@services/wallets/get-wallet.service";

@ApiTags("Wallets")
@Controller("wallets")
export class GetWalletController {
  constructor(private readonly service: GetWalletService) {}
}
