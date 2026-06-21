-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'FORUM_REACTION';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN "notifyForumReactions" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "ForumComment" ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ForumCommentLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumCommentLike_userId_commentId_key" ON "ForumCommentLike"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "ForumCommentLike" ADD CONSTRAINT "ForumCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ForumCommentLike" ADD CONSTRAINT "ForumCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ForumComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
