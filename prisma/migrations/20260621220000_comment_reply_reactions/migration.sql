-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN "replyToCommentId" TEXT;

-- AddForeignKey
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_replyToCommentId_fkey" FOREIGN KEY ("replyToCommentId") REFERENCES "ForumComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate text reactions into chat messages with reply link
INSERT INTO "ForumComment" ("id", "threadId", "authorId", "body", "likeCount", "replyToCommentId", "status", "createdAt", "updatedAt")
SELECT
  r."id",
  c."threadId",
  r."authorId",
  r."body",
  0,
  r."commentId",
  'APPROVED',
  r."createdAt",
  r."createdAt"
FROM "ForumCommentTextReaction" r
JOIN "ForumComment" c ON c."id" = r."commentId";

-- DropTable
DROP TABLE "ForumCommentTextReaction";
