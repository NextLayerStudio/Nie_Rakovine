-- Split name into firstName/lastName going forward. fullName is kept and
-- still populated (firstName + " " + lastName) so every existing read of
-- user.fullName across the app keeps working unchanged.
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;

-- Best-effort backfill for existing accounts from their current fullName,
-- so the new columns aren't left empty for users who registered earlier.
UPDATE "User"
SET
  "firstName" = split_part("fullName", ' ', 1),
  "lastName" = CASE
    WHEN position(' ' in "fullName") = 0 THEN NULL
    ELSE NULLIF(trim(substring("fullName" from position(' ' in "fullName") + 1)), '')
  END
WHERE "firstName" IS NULL;
