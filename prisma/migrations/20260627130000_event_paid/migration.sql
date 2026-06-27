-- CreateEnum
CREATE TYPE "EventPaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "isPaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "priceCents" INTEGER;
ALTER TABLE "Event" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN "paymentStatus" "EventPaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE "EventRegistration" ADD COLUMN "paidAt" TIMESTAMP(3);
