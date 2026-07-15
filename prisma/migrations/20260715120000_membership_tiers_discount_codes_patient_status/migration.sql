-- Add FREE and SUPPORTER subscription tiers alongside MONTHLY/YEARLY.
-- Postgres allows adding enum values without recreating the type (unlike
-- removal, see 20260702120000_update_cancer_types) — safe as long as the
-- new values aren't referenced later in this same transaction.
ALTER TYPE "SubscriptionPlan" ADD VALUE 'FREE';
ALTER TYPE "SubscriptionPlan" ADD VALUE 'SUPPORTER';

-- Whether a registering member is a cancer patient themselves — null means
-- not yet answered (legacy accounts predate this step).
ALTER TABLE "UserProfile" ADD COLUMN "isPatient" BOOLEAN;

-- Membership checkout discount codes — distinct from the cosmetic
-- DiscountPartner/DiscountOffer partner-benefit cards, which have no
-- effect on subscription pricing.
CREATE TYPE "DiscountCodeType" AS ENUM ('PERCENT', 'FIXED');

CREATE TABLE "MembershipDiscountCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "DiscountCodeType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipDiscountCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MembershipDiscountCode_code_key" ON "MembershipDiscountCode"("code");
