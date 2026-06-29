import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { ProfileView } from "@/components/profile/ProfileView";
import { requireUser } from "@/lib/auth";
import { visibleThreadsWhere, approvedCommentsCountWhere } from "@/lib/forum-moderation";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { parseProfileTab } from "@/lib/profile-page";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { feedPostSelect } from "@/lib/feed-queries";
import { isEventRegistrationComplete } from "@/lib/event-payment";
import { membershipSubscriptionInfo } from "@/lib/membership-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; setupAvatar?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const initialTab = parseProfileTab(params.tab);
  const forceAvatarPrompt = params.setupAvatar === "1";

  const activityCutoff = new Date();
  activityCutoff.setDate(activityCutoff.getDate() - 14);

  const conversationCutoff = new Date();
  conversationCutoff.setDate(conversationCutoff.getDate() - 60);

  const [
    unreadCount,
    registrations,
    memberships,
    featuredBrands,
    savedDiscountRows,
    savedPostRows,
  ] = await Promise.all([
    getUnreadNotificationCount(user.id),
    prisma.eventRegistration.findMany({
      where: { userId: user.id, event: { published: true } },
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
    prisma.forumMembership.findMany({
      where: { userId: user.id, forum: { published: true } },
      orderBy: { createdAt: "desc" },
      select: {
        forum: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            accentColor: true,
          },
        },
      },
    }),
    prisma.discountPartner.findMany({
      where: { published: true, featured: true },
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      take: 6,
      select: {
        id: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
      },
    }),
    prisma.savedDiscountOffer.findMany({
      where: {
        userId: user.id,
        offer: { published: true, partner: { published: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        offer: {
          select: {
            id: true,
            title: true,
            description: true,
            discountText: true,
            promoCode: true,
            accentColor: true,
            imageUrl: true,
            validUntil: true,
            partner: { select: { handle: true } },
          },
        },
      },
    }),
    prisma.savedPost.findMany({
      where: { userId: user.id, post: { published: true } },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        post: { select: feedPostSelect },
      },
    }),
  ]);

  const followedForumIds = memberships.map((m) => m.forum.id);

  const [recentActivity, userForumThreads] = await Promise.all([
    followedForumIds.length > 0
      ? prisma.forumThread.findMany({
          where: {
            forumId: { in: followedForumIds },
            status: "APPROVED",
            createdAt: { gte: activityCutoff },
          },
          select: { forumId: true },
          distinct: ["forumId"],
        })
      : Promise.resolve([]),
    prisma.forumThread.findMany({
      where: {
        authorId: user.id,
        createdAt: { gte: conversationCutoff },
        forum: { published: true },
        ...visibleThreadsWhere(user.id),
      },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        body: true,
        title: true,
        status: true,
        coverUrl: true,
        likeCount: true,
        forum: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            accentColor: true,
          },
        },
        _count: { select: { comments: approvedCommentsCountWhere() } },
      },
    }),
  ]);

  const threadIds = userForumThreads.map((t) => t.id);
  const likedThreadIds =
    threadIds.length > 0
      ? new Set(
          (
            await prisma.forumThreadLike.findMany({
              where: { userId: user.id, threadId: { in: threadIds } },
              select: { threadId: true },
            })
          ).map((l) => l.threadId),
        )
      : new Set<string>();

  const activeForumIds = new Set(recentActivity.map((t) => t.forumId));

  const savedPosts = savedPostRows.map((row) => row.post);
  const likedSet =
    savedPosts.length > 0
      ? new Set(
          (
            await prisma.articleLike.findMany({
              where: {
                userId: user.id,
                postId: { in: savedPosts.map((p) => p.id) },
              },
              select: { postId: true },
            })
          ).map((l) => l.postId),
        )
      : new Set<string>();

  const nameParts = user.fullName.trim().split(/\s+/).filter(Boolean);

  const data = {
    fullName: user.fullName,
    userId: user.id,
    defaultName: nameParts[0] ?? "",
    defaultSurname: nameParts.slice(1).join(" "),
    profile: user.profile
      ? {
          diagnosis: user.profile.diagnosis,
          diagnosisPhase: user.profile.diagnosisPhase,
          cancerTypes: user.profile.cancerTypes,
        }
      : null,
    unreadCount,
    subscription: membershipSubscriptionInfo(user),
    avatarUrl: user.profile?.avatarUrl ?? null,
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
    forums: memberships.map((m) => ({
      id: m.forum.id,
      title: m.forum.title,
      imageUrl: m.forum.imageUrl,
      accentColor: m.forum.accentColor,
      hasRecentActivity: activeForumIds.has(m.forum.id),
    })),
    forumPosts: userForumThreads.map((t) => ({
      forumId: t.forum.id,
      threadId: t.id,
      authorName: user.fullName,
      title: t.title,
      body: t.body,
      coverUrl: t.coverUrl,
      liked: likedThreadIds.has(t.id),
      likeCount: t.likeCount,
      commentCount: t._count.comments,
      isPending: t.status !== "APPROVED",
    })),
    featuredBrands: featuredBrands.map((b) => ({
      id: b.id,
      handle: b.handle,
      displayName: b.displayName,
      avatarUrl: b.avatarUrl,
    })),
    savedDiscounts: savedDiscountRows.map((row) => ({
      offerId: row.offer.id,
      title: row.offer.title,
      description: row.offer.description,
      discountText: row.offer.discountText,
      promoCode: row.offer.promoCode,
      accentColor: row.offer.accentColor ?? "#F5D5E0",
      imageUrl: row.offer.imageUrl,
      validUntil: row.offer.validUntil?.toISOString() ?? null,
      partnerHandle: row.offer.partner.handle,
    })),
    savedPosts: savedPosts.map((p) => ({
      id: p.id,
      href: postPublicHref(p),
      type: p.type,
      title: p.title,
      excerpt: p.excerpt,
      imageUrls: buildPostGallery(p.coverUrl, p.images),
      videoUrl: p.videoUrl ?? null,
      audioUrl: p.audioUrl ?? null,
      liked: likedSet.has(p.id),
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    })),
  };

  return (
    <PhoneShell>
      <div data-profile-scroll className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <Suspense fallback={null}>
          <ProfileView
            data={data}
            initialTab={initialTab}
            forceAvatarPrompt={forceAvatarPrompt}
          />
        </Suspense>
      </div>
      <BottomNav />
      <MenuDrawer userName={user.fullName} avatarUrl={user.profile?.avatarUrl ?? null} isAdmin={user.role === "ADMIN"} />
      <NotificationsDrawer />
    </PhoneShell>
  );
}
