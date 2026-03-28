/*
  Warnings:

  - You are about to drop the column `status` on the `bets` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `rounds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bets" DROP COLUMN "status",
ADD COLUMN     "bet_status" "BET_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "rounds" DROP COLUMN "status",
ADD COLUMN     "round_status" "ROUND_STATUS" NOT NULL DEFAULT 'WAITING';
