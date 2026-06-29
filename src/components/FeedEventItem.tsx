"use client";

import { useState, useTransition } from "react";
import {
  EventDetailModal,
  type EventModalData,
} from "@/components/EventDetailModal";
import { EventCommentDrawer } from "@/components/EventCommentDrawer";
import { toggleEventLikeAction } from "@/lib/actions/event-likes";
import { formatEventPrice } from "@/lib/event-payment";

export function FeedEventItem({
  id,
  title,
  description,
  startsAt,
  endsAt,
  location,
  coverUrl,
  isRegistered,
  registrationCount,
  capacity,
  defaultName,
  defaultSurname,
  isPaid = false,
  priceCents = null,
  currency = "EUR",
  pendingPayment = false,
  liked: initialLiked = false,
  likeCount: initialLikeCount = 0,
  commentCount: initialCommentCount = 0,
}: {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverUrl: string | null;
  isRegistered: boolean;
  registrationCount?: number;
  capacity?: number;
  defaultName: string;
  defaultSurname: string;
  isPaid?: boolean;
  priceCents?: number | null;
  currency?: string;
  pendingPayment?: boolean;
  liked?: boolean;
  likeCount?: number;
  commentCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [liveRegistered, setLiveRegistered] = useState(isRegistered);
  const [liveCount, setLiveCount] = useState(registrationCount ?? 0);
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [, startTransition] = useTransition();

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => c + (newLiked ? 1 : -1));
    const fd = new FormData();
    fd.set("eventId", id);
    startTransition(() => { void toggleEventLikeAction(fd); });
  };

  const isFull = capacity !== undefined && liveCount >= capacity;

  const cover = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };

  const dateFormatted = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
  }).format(new Date(startsAt));

  const timeFormatted = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));

  const modalEvent: EventModalData = {
    id,
    title,
    description,
    startsAt,
    endsAt,
    location,
    coverUrl,
    isRegistered: liveRegistered,
    registrationCount: liveCount,
    capacity: capacity ?? null,
    defaultName,
    defaultSurname,
    isPaid,
    priceCents,
    currency,
    pendingPayment,
  };

  return (
    <>
      <article className="border-b border-brand-purple/10">
        {/* Obrázok s tlačidlom dole-vľavo */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full text-left"
        >
          <div
            className="aspect-[4/3] max-h-[220px] w-full bg-cover bg-center"
            style={cover}
          />
          <span className="absolute bottom-3 left-4">
            <span
              className={`inline-flex min-w-[11.5rem] items-center justify-between gap-4 rounded-[10px] px-5 py-3 text-sm font-semibold shadow-md backdrop-blur-sm ${
                liveRegistered
                  ? "bg-emerald-500 text-white"
                  : "bg-brand-purple text-white"
              }`}
            >
              {liveRegistered ? (
                <span className="flex items-center gap-2">
                  <CheckIcon />
                  Prihlásený
                </span>
              ) : isPaid && priceCents ? (
                <>
                  <span>Zaplatiť · {formatEventPrice(priceCents, currency)}</span>
                  <ChevronRight />
                </>
              ) : (
                <>
                  <span>Zaregistrovať sa</span>
                  <ChevronRight />
                </>
              )}
            </span>
          </span>
        </button>

        {/* Textový obsah */}
        <div className="px-4 pb-2 pt-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left"
          >
            <h3 className="text-base font-bold text-brand-purple">{title}</h3>

            {/* Meta riadok s ikonkami */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                <CalendarIcon />
                {dateFormatted}
              </span>
              <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                <ClockIcon />
                {timeFormatted}
              </span>
              {location && (
                <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                  <LocationIcon />
                  <span className="max-w-[140px] truncate">{location}</span>
                </span>
              )}
              <span className={`flex items-center gap-1 text-xs font-medium ${isFull ? "text-red-500/70" : "text-brand-purple/55"}`}>
                <PeopleIcon />
                {capacity !== undefined
                  ? `${liveCount}/${capacity}`
                  : liveCount}
              </span>
            </div>

            {description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
                {description}
              </p>
            )}
          </button>

          {/* Like / comment lišta */}
          <div className="mt-3 flex items-center gap-5 pb-3">
            <button
              type="button"
              onClick={toggleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-brand-pink" : "text-brand-purple/60"
              }`}
            >
              <HeartIcon filled={liked} />
              <span className="text-sm font-semibold">
                {likeCount > 0 ? likeCount : "Páči sa mi"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCommentOpen(true)}
              className="flex items-center gap-1.5 text-brand-purple/60"
            >
              <CommentIcon />
              <span className="text-sm font-semibold">
                {commentCount > 0 ? commentCount : "Komentovať"}
              </span>
            </button>
          </div>
        </div>
      </article>

      {open && (
        <EventDetailModal
          event={modalEvent}
          onClose={() => setOpen(false)}
          onRegistered={() => {
            setLiveRegistered(true);
            setLiveCount((c) => c + 1);
          }}
        />
      )}

      <EventCommentDrawer
        eventId={id}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-3.5-4-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M11 13c0-2.21-1.343-4-3-4S5 10.79 5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.5 13c0-1.66-1.007-3-2.25-3M2.5 13c0-1.66 1.007-3 2.25-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? "0" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-150"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
