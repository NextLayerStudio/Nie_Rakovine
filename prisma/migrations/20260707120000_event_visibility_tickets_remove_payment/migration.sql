-- Remove paid-event functionality (never functional — the payment gateway
-- was always a placeholder, so this is dead-code cleanup, not a feature loss).
ALTER TABLE "EventRegistration" DROP COLUMN "paymentStatus";
ALTER TABLE "EventRegistration" DROP COLUMN "paidAt";

ALTER TABLE "Event" DROP COLUMN "isPaid";
ALTER TABLE "Event" DROP COLUMN "priceCents";
ALTER TABLE "Event" DROP COLUMN "currency";

DROP TYPE "EventPaymentStatus";

-- Public / members-only visibility choice for events
CREATE TYPE "EventVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY');

ALTER TABLE "Event" ADD COLUMN "visibility" "EventVisibility" NOT NULL DEFAULT 'PUBLIC';

-- Guest ticket registrations from the public landing page (no account required)
CREATE TABLE "EventTicket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventTicket_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EventTicket_eventId_idx" ON "EventTicket"("eventId");

ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
