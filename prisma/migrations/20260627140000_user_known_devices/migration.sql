-- CreateTable
CREATE TABLE "UserKnownDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "label" TEXT,
    "userAgent" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserKnownDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserKnownDevice_userId_deviceId_key" ON "UserKnownDevice"("userId", "deviceId");

-- CreateIndex
CREATE INDEX "UserKnownDevice_userId_lastSeenAt_idx" ON "UserKnownDevice"("userId", "lastSeenAt" DESC);

-- AddForeignKey
ALTER TABLE "UserKnownDevice" ADD CONSTRAINT "UserKnownDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
