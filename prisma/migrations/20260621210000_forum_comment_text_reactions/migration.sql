-- CreateTable
CREATE TABLE "ForumCommentTextReaction" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumCommentTextReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ForumCommentTextReaction_commentId_createdAt_idx" ON "ForumCommentTextReaction"("commentId", "createdAt");

-- AddForeignKey
ALTER TABLE "ForumCommentTextReaction" ADD CONSTRAINT "ForumCommentTextReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ForumComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ForumCommentTextReaction" ADD CONSTRAINT "ForumCommentTextReaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
