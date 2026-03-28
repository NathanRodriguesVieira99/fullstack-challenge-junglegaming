export const KAFKA_CLIENTS = {
  PRODUCER: "WALLETS_KAFKA_PRODUCER",
  CONSUMER: "WALLETS_KAFKA_CONSUMER",
};

export const KAFKA_GROUPS = {
  KAFKA_CONSUMER_GROUP: "WALLETS_GROUP",
};

export const KAFKA_CLIENTS_IDS = {
  KAFKA_PRODUCER_CLIENT_ID: "WALLETS_SERVICE_PRODUCER",
  KAFKA_CONSUMER_CLIENT_ID: "WALLETS_SERVICE_CONSUMER",
} as const;

export const KAFKA_BROKER = "kafka:29092"; // fora do Docker => localhost:9092

export const KAFKA_TOPICS = {
  DEBIT_TRANSACTION: "debit.transaction",
  CREDIT_TRANSACTION: "credit.transaction",
  WALLET_CREATED: "wallet.created",
} as const;
