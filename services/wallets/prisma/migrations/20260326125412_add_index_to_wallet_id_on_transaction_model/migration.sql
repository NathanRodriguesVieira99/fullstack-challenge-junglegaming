/*
  Warnings:

  - The `status` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `playerId` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `wallet_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `player_id` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_wallet_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "wallet_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "playerId",
ADD COLUMN     "player_id" TEXT NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0;

-- DropEnum
DROP TYPE "TRANSACTION_STATUS";

-- DropEnum
DROP TYPE "TRANSACTION_TYPE";

-- CreateIndex
CREATE INDEX "transactions_wallet_id_idx" ON "transactions"("wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_player_id_key" ON "wallets"("player_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
