-- AlterTable: link posts to discount partners ("reklama") and a specific card
ALTER TABLE "Post" ADD COLUMN "discountPartnerId" TEXT;
ALTER TABLE "Post" ADD COLUMN "linkedOfferId" TEXT;

-- CreateIndex
CREATE INDEX "Post_discountPartnerId_published_publishedAt_idx" ON "Post"("discountPartnerId", "published", "publishedAt" DESC);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_discountPartnerId_fkey" FOREIGN KEY ("discountPartnerId") REFERENCES "DiscountPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_linkedOfferId_fkey" FOREIGN KEY ("linkedOfferId") REFERENCES "DiscountOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
