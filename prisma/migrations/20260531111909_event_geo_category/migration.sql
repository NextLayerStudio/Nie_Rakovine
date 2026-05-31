-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('EDUKACNE', 'RELAXACNE', 'FYZICKE', 'MENTALNE', 'EXTERNE', 'INTERNE');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_EVENT_NEARBY';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "EventCategory",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventId" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "notifyRadiusKm" INTEGER NOT NULL DEFAULT 50;
