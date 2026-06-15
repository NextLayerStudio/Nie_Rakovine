-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "consentMembership" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "consentNewsletter" BOOLEAN NOT NULL DEFAULT false;
