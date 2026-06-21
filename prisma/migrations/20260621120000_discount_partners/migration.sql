-- CreateEnum
CREATE TYPE "DiscountCategory" AS ENUM ('MODA', 'KOZMETIKA', 'JEDLO', 'ZAZITKY');

-- CreateTable
CREATE TABLE "DiscountPartner" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "coverUrl" TEXT,
    "category" "DiscountCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountOffer" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discountText" TEXT,
    "promoCode" TEXT,
    "accentColor" TEXT DEFAULT '#F5D5E0',
    "imageUrl" TEXT,
    "validUntil" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedDiscountOffer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedDiscountOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountPartner_handle_key" ON "DiscountPartner"("handle");

-- CreateIndex
CREATE INDEX "DiscountPartner_published_featured_sortOrder_idx" ON "DiscountPartner"("published", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "DiscountPartner_category_published_sortOrder_idx" ON "DiscountPartner"("category", "published", "sortOrder");

-- CreateIndex
CREATE INDEX "DiscountOffer_partnerId_published_sortOrder_idx" ON "DiscountOffer"("partnerId", "published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SavedDiscountOffer_userId_offerId_key" ON "SavedDiscountOffer"("userId", "offerId");

-- CreateIndex
CREATE INDEX "SavedDiscountOffer_userId_createdAt_idx" ON "SavedDiscountOffer"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "DiscountOffer" ADD CONSTRAINT "DiscountOffer_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "DiscountPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDiscountOffer" ADD CONSTRAINT "SavedDiscountOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDiscountOffer" ADD CONSTRAINT "SavedDiscountOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "DiscountOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
