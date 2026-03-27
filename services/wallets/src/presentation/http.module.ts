import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";

/*  Controllers */
import { HealthController } from "../presentation/controllers/health/health.controller";
import { GetWalletController } from "../presentation/controllers/wallets/get-wallet.controller";
import { CreateWalletController } from "../presentation/controllers/wallets/create-wallet.controller";
import { CreditController } from "./controllers/transactions/credit.controller";
import { DebitController } from "./controllers/transactions/debit.controller";

/*  Services */
import { CreateWalletService } from "../application/services/wallets/create-wallet.service";
import { GetWalletService } from "../application/services/wallets/get-wallet.service";
import { CreditService } from "../application/services/transactions/credit.service";
import { DebitService } from "../application/services/transactions/debit.service";

/*  Repositories */
import { WalletsRepositoryContract } from "../domain/repositories/wallets/wallets.repository.contract";
import { WalletsRepositoryImplementation } from "../domain/repositories/wallets/wallets.repository.implementation";
import { TransactionRepositoryContract } from "../domain/repositories/transactions/transactions.repository.contract";
import { TransactionsRepositoryImplementation } from "../domain/repositories/transactions/transactions.repository.implementation";

@Module({
  imports: [
    /* usado para transformar o service em producer */
    ClientsModule.register([
      {
        name: "wallets-producer",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "WALLETS_SERVICE_PRODUCER",
            brokers: ["kafka:29092"], // fora do Docker => localhost:9092
          },
        },
      },
    ]),
  ],
  controllers: [
    HealthController,
    GetWalletController,
    CreateWalletController,
    CreditController,
    DebitController,
  ],
  providers: [
    {
      provide: WalletsRepositoryContract,
      useClass: WalletsRepositoryImplementation,
    },
    {
      provide: TransactionRepositoryContract,
      useClass: TransactionsRepositoryImplementation,
    },
    CreateWalletService,
    GetWalletService,
    DebitService,
    CreditService,
  ],
})
export class httpModule {}
