-- Mood Meter: daily mood check-in
--   * New MoodEntry table, one row per check-in (1-5 score + optional note)
--   * Individual entries are private to the member — no admin read path here

CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MoodEntry_userId_createdAt_idx" ON "MoodEntry"("userId", "createdAt" DESC);

ALTER TABLE "MoodEntry"
    ADD CONSTRAINT "MoodEntry_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
