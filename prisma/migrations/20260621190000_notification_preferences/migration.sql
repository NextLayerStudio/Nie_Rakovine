-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN "notifyNewPosts" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserProfile" ADD COLUMN "notifyForumApproved" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserProfile" ADD COLUMN "notifyEventsNearby" BOOLEAN NOT NULL DEFAULT true;
