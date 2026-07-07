-- Structured region (kraj) for events, used to filter the public /podujatia page
CREATE TYPE "EventRegion" AS ENUM ('BRATISLAVSKY', 'TRNAVSKY', 'TRENCIANSKY', 'NITRIANSKY', 'ZILINSKY', 'BANSKOBYSTRICKY', 'PRESOVSKY', 'KOSICKY');

ALTER TABLE "Event" ADD COLUMN "region" "EventRegion";
