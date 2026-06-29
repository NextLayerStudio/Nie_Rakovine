import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileTabBar } from "@/components/profile/ProfileTabBar";
import { ProfileView } from "@/components/profile/ProfileView";
import { readSession } from "@/lib/auth";
import { membershipSubscriptionInfo } from "@/lib/membership-card";
import { parseProfileTab } from "@/lib/profile-page";
import { isEventRegistrationComplete } from "@/lib/event-payment";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-purple/15 border-t-brand-pink" />
    </div>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; setupAvatar?: string }>;
}) {
  // JWT verify only — no DB yet
  const session = await readSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const initialTab = parseProfileTab(params.tab);
  const forceAvatarPrompt = params.setupAvatar === "1";

  // All three DB queries in parallel — one round-trip to Neon
  const [user, unreadCount, registrations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    prisma.notification.count({
      where: { userId: session.userId, read: false },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: session.userId, event: { published: true } },
      orderBy: { event: { startsAt: "asc" } },
      select: {
        paymentStatus: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            coverUrl: true,
            startsAt: true,
            endsAt: true,
            location: true,
            capacity: true,
            isPaid: true,
            priceCents: true,
            currency: true,
            _count: { select: { registrations: true } },
          },
        },
      },
    }),
  ]);

  if (!user) redirect("/login");

  const nameParts = user.fullName.trim().split(/\s+/).filter(Boolean);

  // Calendar tab data is ready — no extra client round-trip needed
  const initialCalendarData = {
    ok: true as const,
    defaultName: nameParts[0] ?? "",
    defaultSurname: nameParts.slice(1).join(" "),
    registeredEvents: registrations
      .filter((r) => isEventRegistrationComplete(r, r.event.isPaid))
      .map((r) => ({
        id: r.event.id,
        title: r.event.title,
        description: r.event.description,
        coverUrl: r.event.coverUrl,
        startsAt: r.event.startsAt.toISOString(),
        endsAt: r.event.endsAt?.toISOString() ?? null,
        location: r.event.location,
        registrationCount: r.event._count.registrations,
        capacity: r.event.capacity,
        isPaid: r.event.isPaid,
        priceCents: r.event.priceCents,
        currency: r.event.currency,
      })),
  };

  return (
    <PhoneShell>
      <div
        data-profile-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        {/* Render immediately — no JS wait */}
        <ProfileHeader unreadCount={unreadCount} />
        <ProfileIdentityCard
          fullName={user.fullName}
          userId={user.id}
          profile={
            user.profile
              ? {
                  diagnosis: user.profile.diagnosis,
                  diagnosisPhase: user.profile.diagnosisPhase,
                  cancerTypes: user.profile.cancerTypes,
                }
              : null
          }
          subscription={membershipSubscriptionInfo(user)}
          avatarUrl={user.profile?.avatarUrl ?? null}
          forceAvatarPrompt={forceAvatarPrompt}
        />
        <ProfileTabBar initialTab={initialTab} />

        {/* Tab content — useSearchParams requires Suspense */}
        <Suspense fallback={<TabSpinner />}>
          <ProfileView
            initialTab={initialTab}
            initialCalendarData={initialCalendarData}
          />
        </Suspense>
      </div>
      <BottomNav />
      <MenuDrawer
        userName={user.fullName}
        avatarUrl={user.profile?.avatarUrl ?? null}
        isAdmin={user.role === "ADMIN"}
      />
      <NotificationsDrawer />
    </PhoneShell>
  );
}
