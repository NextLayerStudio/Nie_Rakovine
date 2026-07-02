-- Update CancerType taxonomy:
--   * add KONECNIK (Konečník) and SEMENNIKY (Semenníky)
--   * remove ZALUDOK, PECEN, LYMFOM, LEUKEMIA, MOZOG, STITNA_ZLAZA, HLAVA_KRK
--   * existing rows using a removed value are remapped to INE
--
-- Postgres cannot drop enum values in place, so we recreate the type and
-- migrate every column that uses it. Removed values are first rewritten to INE
-- (via array_replace) so the subsequent array cast only sees valid members.

-- 1. Remap removed values to INE in every array column (still the old type).
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'ZALUDOK', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'PECEN', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'LYMFOM', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'LEUKEMIA', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'MOZOG', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'STITNA_ZLAZA', 'INE');
UPDATE "UserProfile" SET "cancerTypes" = array_replace("cancerTypes", 'HLAVA_KRK', 'INE');

UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'ZALUDOK', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'PECEN', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'LYMFOM', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'LEUKEMIA', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'MOZOG', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'STITNA_ZLAZA', 'INE');
UPDATE "ClubProfile" SET "cancerTypes" = array_replace("cancerTypes", 'HLAVA_KRK', 'INE');

UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'ZALUDOK', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'PECEN', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'LYMFOM', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'LEUKEMIA', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'MOZOG', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'STITNA_ZLAZA', 'INE');
UPDATE "Post" SET "cancerTypes" = array_replace("cancerTypes", 'HLAVA_KRK', 'INE');

UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'ZALUDOK', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'PECEN', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'LYMFOM', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'LEUKEMIA', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'MOZOG', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'STITNA_ZLAZA', 'INE');
UPDATE "Event" SET "cancerTypes" = array_replace("cancerTypes", 'HLAVA_KRK', 'INE');

UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'ZALUDOK', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'PECEN', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'LYMFOM', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'LEUKEMIA', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'MOZOG', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'STITNA_ZLAZA', 'INE');
UPDATE "Forum" SET "cancerTypes" = array_replace("cancerTypes", 'HLAVA_KRK', 'INE');

-- 2. New enum with the final, curated set (order matches the app UI).
CREATE TYPE "CancerType_new" AS ENUM (
  'PRSNIK',
  'HRUBE_CREVO',
  'KONECNIK',
  'PLUCA',
  'PROSTATA',
  'PODZALUDKOVA',
  'SEMENNIKY',
  'KOZA',
  'KRCOK_MATERNICE',
  'VAJECNIKY',
  'TELO_MATERNICE',
  'MOCOVE_CESTY',
  'INE'
);

-- 3. Switch every column to the new type (all remaining values are valid members).
ALTER TABLE "UserProfile" ALTER COLUMN "cancerTypes" DROP DEFAULT;
ALTER TABLE "UserProfile" ALTER COLUMN "cancerTypes" TYPE "CancerType_new"[] USING ("cancerTypes"::text[]::"CancerType_new"[]);
ALTER TABLE "UserProfile" ALTER COLUMN "cancerTypes" SET DEFAULT ARRAY[]::"CancerType_new"[];

ALTER TABLE "ClubProfile" ALTER COLUMN "cancerTypes" DROP DEFAULT;
ALTER TABLE "ClubProfile" ALTER COLUMN "cancerTypes" TYPE "CancerType_new"[] USING ("cancerTypes"::text[]::"CancerType_new"[]);
ALTER TABLE "ClubProfile" ALTER COLUMN "cancerTypes" SET DEFAULT ARRAY[]::"CancerType_new"[];

ALTER TABLE "Post" ALTER COLUMN "cancerTypes" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "cancerTypes" TYPE "CancerType_new"[] USING ("cancerTypes"::text[]::"CancerType_new"[]);
ALTER TABLE "Post" ALTER COLUMN "cancerTypes" SET DEFAULT ARRAY[]::"CancerType_new"[];

ALTER TABLE "Event" ALTER COLUMN "cancerTypes" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "cancerTypes" TYPE "CancerType_new"[] USING ("cancerTypes"::text[]::"CancerType_new"[]);
ALTER TABLE "Event" ALTER COLUMN "cancerTypes" SET DEFAULT ARRAY[]::"CancerType_new"[];

ALTER TABLE "Forum" ALTER COLUMN "cancerTypes" DROP DEFAULT;
ALTER TABLE "Forum" ALTER COLUMN "cancerTypes" TYPE "CancerType_new"[] USING ("cancerTypes"::text[]::"CancerType_new"[]);
ALTER TABLE "Forum" ALTER COLUMN "cancerTypes" SET DEFAULT ARRAY[]::"CancerType_new"[];

-- 4. Swap the types.
DROP TYPE "CancerType";
ALTER TYPE "CancerType_new" RENAME TO "CancerType";
