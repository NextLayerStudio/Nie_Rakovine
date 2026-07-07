-- Remove duplicate guest tickets for the same event+email (keep the earliest),
-- so the new unique constraint below can be applied safely on existing data.
DELETE FROM "EventTicket" a USING "EventTicket" b
WHERE a."eventId" = b."eventId"
  AND a."email" = b."email"
  AND a."id" <> b."id"
  AND (a."createdAt" > b."createdAt" OR (a."createdAt" = b."createdAt" AND a."id" > b."id"));

-- One ticket per person (by email) per event
CREATE UNIQUE INDEX "EventTicket_eventId_email_key" ON "EventTicket"("eventId", "email");
