-- CreateEnum
CREATE TYPE "BET_STATUS" AS ENUM ('PENDING', 'WON', 'LOST', 'CASHED_OUT');

-- CreateEnum
CREATE TYPE "ROUND_STATUS" AS ENUM ('WAITING', 'RUNNING', 'CRASHED', 'FINALIZED');

-- CreateTable
CREATE TABLE "bets" (
    "id" TEXT NOT NULL,
    "status" "BET_STATUS" NOT NULL,
    "amount" BIGINT NOT NULL,
    "cashed_out_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player_id" TEXT NOT NULL,
    "round_id" TEXT NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" TEXT NOT NULL,
    "status" "ROUND_STATUS" NOT NULL,
    "crash_point" DOUBLE PRECISION NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL,
    "provably_fair_hash" TEXT NOT NULL,
    "provably_fair_salt" TEXT NOT NULL,
    "provably_fair_result" TEXT NOT NULL,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
