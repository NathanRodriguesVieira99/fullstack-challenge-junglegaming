import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class CreditService {
  constructor() // @Inject("wallets-producer") private readonly kafka: ClientKafka,
  {}
  async execute() {}
}
