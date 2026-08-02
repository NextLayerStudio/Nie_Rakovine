-- AlterEnum
ALTER TYPE "SubscriptionPlan" ADD VALUE 'TRIAL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "trialUsedAt" TIMESTAMP(3);
