-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PENDING_PAYMENT';

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "paymentMethod" "PaymentMethod";
ALTER TABLE "User" ADD COLUMN "paymentVariableSymbol" TEXT;
ALTER TABLE "User" ADD COLUMN "paymentAmountEuro" DOUBLE PRECISION;
ALTER TABLE "User" ADD COLUMN "paymentConfirmedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_paymentVariableSymbol_key" ON "User"("paymentVariableSymbol");
