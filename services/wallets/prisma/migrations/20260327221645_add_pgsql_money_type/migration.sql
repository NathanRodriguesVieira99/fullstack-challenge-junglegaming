/*
  Warnings:

  - The `balance` column on the `wallets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `transaction_value` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_value",
ADD COLUMN     "transaction_value" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "balance",
ADD COLUMN     "balance" MONEY NOT NULL DEFAULT 0;
