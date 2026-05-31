-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "profileId" TEXT;

-- CreateTable
CREATE TABLE "ClubProfile" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "coverUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubProfile_handle_key" ON "ClubProfile"("handle");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ClubProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ClubProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
