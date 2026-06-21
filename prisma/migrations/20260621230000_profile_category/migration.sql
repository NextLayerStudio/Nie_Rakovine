-- CreateEnum
CREATE TYPE "ProfileCategory" AS ENUM ('ZDRAVA_VYZIVA', 'SPONZORI', 'DIAGNOZY', 'NOVINKY', 'AKCIE');

-- AlterTable
ALTER TABLE "ClubProfile" ADD COLUMN "category" "ProfileCategory";

-- CreateIndex
CREATE INDEX "ClubProfile_category_published_idx" ON "ClubProfile"("category", "published");
