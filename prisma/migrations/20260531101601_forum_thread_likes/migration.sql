-- CreateTable
CREATE TABLE "ForumThreadLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumThreadLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumThreadLike_userId_threadId_key" ON "ForumThreadLike"("userId", "threadId");

-- AddForeignKey
ALTER TABLE "ForumThreadLike" ADD CONSTRAINT "ForumThreadLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumThreadLike" ADD CONSTRAINT "ForumThreadLike_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
