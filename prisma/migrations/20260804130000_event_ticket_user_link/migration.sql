-- Unify event attendance: EventTicket now covers both members and guests.
-- Members registering via the app get a linked ticket (userId set) so the
-- same QR code / ticket page / cancellation flow works for everyone.
ALTER TABLE "EventTicket" ADD COLUMN "userId" TEXT;

ALTER TABLE "EventTicket"
  ADD CONSTRAINT "EventTicket_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "EventTicket_userId_idx" ON "EventTicket"("userId");

-- Backfill: give every existing member EventRegistration a matching
-- EventTicket, so past registrations also get a working listok/QR page and
-- show up in the unified attendee list. If a guest ticket already exists for
-- the same event+email (e.g. they registered as a guest before creating an
-- account), link it to the member instead of creating a duplicate.
INSERT INTO "EventTicket" (id, "eventId", "userId", "firstName", "lastName", email, phone, "consentPrivacy", "createdAt")
SELECT
  md5(random()::text || clock_timestamp()::text || r.id),
  r."eventId",
  r."userId",
  CASE
    WHEN NULLIF(TRIM(r."name"), '') IS NOT NULL THEN TRIM(r."name")
    WHEN POSITION(' ' IN u."fullName") > 0 THEN TRIM(SUBSTRING(u."fullName" FROM 1 FOR POSITION(' ' IN u."fullName") - 1))
    ELSE TRIM(u."fullName")
  END,
  CASE
    WHEN NULLIF(TRIM(r."surname"), '') IS NOT NULL THEN TRIM(r."surname")
    WHEN POSITION(' ' IN u."fullName") > 0 THEN TRIM(SUBSTRING(u."fullName" FROM POSITION(' ' IN u."fullName") + 1))
    ELSE ''
  END,
  u.email,
  NULL,
  true,
  r."createdAt"
FROM "EventRegistration" r
JOIN "User" u ON u.id = r."userId"
ON CONFLICT ("eventId", "email") DO UPDATE SET "userId" = EXCLUDED."userId";
