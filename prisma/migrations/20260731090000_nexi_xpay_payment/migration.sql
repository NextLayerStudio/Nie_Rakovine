-- AlterTable
ALTER TABLE "User" ADD COLUMN "nexiContractId" TEXT;
ALTER TABLE "User" ADD COLUMN "pendingNexiOrderId" TEXT;
ALTER TABLE "User" ADD COLUMN "pendingNexiSecurityToken" TEXT;
ALTER TABLE "User" ADD COLUMN "pendingNexiPlan" "SubscriptionPlan";

-- CreateIndex
CREATE UNIQUE INDEX "User_nexiContractId_key" ON "User"("nexiContractId");
CREATE UNIQUE INDEX "User_pendingNexiOrderId_key" ON "User"("pendingNexiOrderId");
