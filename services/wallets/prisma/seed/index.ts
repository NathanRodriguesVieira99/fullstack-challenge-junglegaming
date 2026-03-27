import { PrismaPg } from "@prisma/adapter-pg";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient } from "../../src/infrastructure/database/generated/client";
import { Decimal } from "@prisma/client/runtime/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function createPlayers() {
  const username = faker.person.firstName();
  const player = await prisma.player.create({
    data: {
      username,
      wallet: {
        create: {
          balance: new Decimal(500),
          playerId: faker.string.uuid(),
        },
      },
    },
    include: { wallet: true },
  });

  return { username: player.username, walletId: player.walletId };
}

async function seedTransactions() {
  const wallets = await prisma.wallet.findMany();
  if (wallets.length === 0) throw new Error("Wallet not found");

  const count = Number(10);
  for (let i = 0; i < count; i++) {
    const status = faker.helpers.arrayElement([
      "PENDING",
      "CONFIRMED",
      "FAILED",
    ]);
    const type = faker.helpers.arrayElement(["DEBIT", "CREDIT"]);
    const transactionValue = new Decimal(500);

    const wallet = faker.helpers.arrayElement(wallets);
    await prisma.transaction.create({
      data: {
        status,
        type,
        transactionValue,
        walletId: wallet.id,
      },
    });
  }
}

async function seedPlayers() {
  const count = Number(10);
  for (let i = 0; i < count; i++) {
    await createPlayers();
  }
}

async function seed() {
  if (!prisma) return;
  await prisma.transaction.deleteMany();
  await prisma.player.deleteMany();
  await prisma.wallet.deleteMany();
  await seedPlayers();
  await seedTransactions();
  await prisma.$disconnect();
}

async function main() {
  await seed();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
