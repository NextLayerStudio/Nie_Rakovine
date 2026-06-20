-- Flag posts that appear in Kontent knižnica → Novinky
ALTER TABLE "Post" ADD COLUMN "isNovinka" BOOLEAN NOT NULL DEFAULT false;

-- Legacy NEWS-type posts become novinky
UPDATE "Post" SET "isNovinka" = true WHERE "type" = 'NEWS';

CREATE INDEX "Post_isNovinka_published_publishedAt_idx" ON "Post"("isNovinka", "published", "publishedAt" DESC);
