-- Add NEWS (newsletter) value to PostType enum
ALTER TYPE "PostType" ADD VALUE 'NEWS';

-- Optional media duration (seconds) for AUDIO / VIDEO posts
ALTER TABLE "Post" ADD COLUMN "durationSec" INTEGER;
