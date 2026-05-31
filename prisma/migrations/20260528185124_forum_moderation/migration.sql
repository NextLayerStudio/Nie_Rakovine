-- CreateEnum
CREATE TYPE "ForumModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN     "status" "ForumModerationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ForumThread" ADD COLUMN     "status" "ForumModerationStatus" NOT NULL DEFAULT 'PENDING';
