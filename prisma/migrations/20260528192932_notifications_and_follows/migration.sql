-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_POST', 'FORUM_THREAD_APPROVED', 'FORUM_COMMENT_APPROVED');

-- CreateTable
CREATE TABLE "ProfileFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT,
    "threadId" TEXT,
    "commentId" TEXT,
    "profileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileFollow_userId_profileId_key" ON "ProfileFollow"("userId", "profileId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- AddForeignKey
ALTER TABLE "ProfileFollow" ADD CONSTRAINT "ProfileFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileFollow" ADD CONSTRAINT "ProfileFollow_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ClubProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
