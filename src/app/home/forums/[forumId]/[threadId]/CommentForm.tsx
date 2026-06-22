"use client";

import { useRef, useTransition } from "react";
import { createCommentAction } from "@/lib/actions/forums";
import type { ReplyTarget } from "@/components/ForumThreadChat";

export function CommentForm({
  forumId,
  threadId,
  replyTo,
  onClearReply,
  onOptimisticSend,
}: {
  forumId: string;
  threadId: string;
  replyTo?: ReplyTarget | null;
  onClearReply?: () => void;
  onOptimisticSend?: (body: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [, startTransition] = useTransition();

  function handleSend() {
    const body = textareaRef.current?.value?.trim();
    if (!body) return;
    onOptimisticSend?.(body);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
    const fd = new FormData();
    fd.set("forumId", forumId);
    fd.set("threadId", threadId);
    if (replyTo) fd.set("replyToCommentId", replyTo.commentId);
    fd.set("body", body);
    startTransition(async () => {
      await createCommentAction({ ok: false }, fd);
    });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-purple/10 bg-white/95 px-5 pt-3 backdrop-blur-md shadow-[0_-4px_24px_rgba(111,35,128,0.08)]"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-[460px]">
        {replyTo && (
          <div className="mb-2 flex items-start gap-2 rounded-2xl border border-brand-pink/25 bg-brand-pink/8 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-brand-pink">
                Reakcia na správu od
              </p>
              <p className="text-[11px] font-semibold text-brand-purple/75">
                {replyTo.authorName}
              </p>
              <p className="line-clamp-2 text-xs leading-snug text-brand-purple/60">
                {replyTo.body}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearReply}
              aria-label="Zrušiť reakciu"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-brand-purple/50 hover:bg-brand-purple/10 hover:text-brand-purple"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 rounded-[28px] bg-brand-pink p-2 pl-4 shadow-soft">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={replyTo ? "Napíšte reakciu…" : "Napíšte správu…"}
            className="max-h-28 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-snug text-white placeholder-white/75 outline-none"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            aria-label="Odoslať"
            onClick={handleSend}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand-pink transition hover:brightness-95 active:scale-95"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 12l14-7-4 14-2-5-5-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
