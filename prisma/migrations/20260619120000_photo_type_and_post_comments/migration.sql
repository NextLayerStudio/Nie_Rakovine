-- Add PHOTO value to PostType enum
ALTER TYPE "PostType" ADD VALUE 'PHOTO';

-- Create PostComment table
CREATE TABLE "PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "PostComment_postId_createdAt_idx" ON "PostComment"("postId", "createdAt");

-- Foreign keys
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
