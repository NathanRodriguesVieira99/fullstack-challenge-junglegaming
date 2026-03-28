import { PrismaPg } from "@prisma/adapter-pg";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { PrismaClient } from "../../src/infrastructure/database/generated/client";
import { Decimal } from "@prisma/client/runtime/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function createBets() {
  await prisma.bet.create({
    data: {
      playerId: faker.string.uuid(),
      amount: new Decimal(500),
      betStatus: faker.helpers.arrayElement([
        "PENDING",
        "WON",
        "LOST",
        "CASHED_OUT",
      ]),
      cashedOutAt: new Date(),
      round: {
        create: {
          roundStatus: faker.helpers.arrayElement([
            "WAITING",
            "RUNNING",
            "CRASHED",
            "FINALIZED",
          ]),
          crashPoint: faker.number.float(),
          endTime: new Date(),
          startTime: new Date(),
          provablyFairSalt: faker.string.uuid(),
          provablyFairHash: faker.string.uuid(),
          provablyFairResult: faker.lorem.word(),
        },
      },
    },
  });
}

async function seedBets() {
  for (let i = 0; i < 50; i++) {
    await createBets();
  }
}

async function seed() {
  if (!prisma) return;
  await prisma.bet.deleteMany();
  await prisma.round.deleteMany();
  await seedBets();
  await prisma.$disconnect();
}

async function main() {
  await seed();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
