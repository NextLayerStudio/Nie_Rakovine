-- Add AUDIO value to PostType enum
ALTER TYPE "PostType" ADD VALUE 'AUDIO';

-- Audio file URL for AUDIO posts
ALTER TABLE "Post" ADD COLUMN "audioUrl" TEXT;
