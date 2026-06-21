import Link from "next/link";
import { forumAvatarStyle } from "@/lib/avatar-style";

export type ProfileForumChip = {
  id: string;
  title: string;
  imageUrl: string | null;
  accentColor: string | null;
  hasRecentActivity: boolean;
};

export type ProfileForumConversation = {
  forumId: string;
  forumTitle: string;
  forumImageUrl: string | null;
  forumAccentColor: string | null;
  threadId: string;
  question: string;
  answer: string | null;
};

export function ProfileForumsTab({
  forums,
  conversations,
}: {
  forums: ProfileForumChip[];
  conversations: ProfileForumConversation[];
}) {
  return (
    <div className="px-4 pb-6 pt-3">
      {forums.length > 0 && (
        <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
          <div className="flex gap-3">
            {forums.map((forum) => (
              <Link
                key={forum.id}
                href={`/home/forums/${forum.id}`}
                className="relative shrink-0"
                aria-label={forum.title}
              >
                <div
                  className="h-14 w-14 rounded-full ring-2 ring-white"
                  style={forumAvatarStyle(forum)}
                  aria-hidden
                />
                {forum.hasRecentActivity && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-bold text-brand-purple">
        Moje otázky &amp; odpovede
      </h2>

      {conversations.length === 0 ? (
        <p className="text-center text-xs text-brand-purple/55">
          {forums.length === 0
            ? "Zatiaľ nesledujete žiadne fóra."
            : "Vo vašich fórach zatiaľ nie sú nové konverzácie."}
        </p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((item) => (
            <li
              key={item.threadId}
              className="rounded-3xl bg-white p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-full"
                  style={forumAvatarStyle({
                    imageUrl: item.forumImageUrl,
                    accentColor: item.forumAccentColor,
                  })}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-purple">
                    {item.forumTitle}
                  </p>
                  <span className="mt-0.5 inline-block rounded-pill bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold text-brand-purple/70">
                    Sledované
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs leading-relaxed text-brand-purple/80">
                <p>
                  <span className="font-bold text-brand-purple">Otázka: </span>
                  {truncate(item.question, 140)}
                </p>
                {item.answer && (
                  <p>
                    <span className="font-bold text-brand-purple">Odpoveď: </span>
                    {truncate(item.answer, 140)}
                  </p>
                )}
              </div>

              <Link
                href={`/home/forums/${item.forumId}/${item.threadId}`}
                className="mt-4 inline-flex rounded-pill bg-brand-pink px-4 py-2 text-xs font-bold text-white"
              >
                Celá konverzácia
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}
