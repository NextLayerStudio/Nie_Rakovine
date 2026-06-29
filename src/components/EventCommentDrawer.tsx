"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  addEventCommentAction,
  fetchEventCommentsAction,
} from "@/lib/actions/event-comments";

type Comment = { id: string; body: string; authorName: string; createdAt: string };

export function EventCommentDrawer({
  eventId,
  open,
  onClose,
  onCommentAdded,
}: {
  eventId: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchEventCommentsAction(eventId).then((res) => {
      if (res.ok) setComments(res.comments);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    });
  }, [open, eventId]);

  const submit = () => {
    if (!body.trim()) return;
    const optimistic: Comment = {
      id: `opt-${Date.now()}`,
      body: body.trim(),
      authorName: "Ja",
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, optimistic]);
    setBody("");
    onCommentAdded?.();
    const fd = new FormData();
    fd.set("eventId", eventId);
    fd.set("body", optimistic.body);
    startTransition(() => { void addEventCommentAction(fd); });
    setTimeout(() => listRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 50);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[101] flex max-h-[75svh] flex-col rounded-t-3xl bg-white",
          "mx-auto max-w-[430px]",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-brand-purple/20" />
        </div>

        <div className="flex items-center justify-between border-b border-brand-purple/10 px-4 pb-2">
          <h3 className="text-sm font-bold text-brand-purple">Komentáre</h3>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loading && (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-10 rounded-xl bg-brand-purple/5 animate-pulse" />)}
            </div>
          )}
          {!loading && comments.length === 0 && (
            <p className="text-center text-sm text-brand-purple/50 py-4">Zatiaľ žiadne komentáre. Buďte prví!</p>
          )}
          {!loading && comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-brand-pink/30" />
              <div>
                <p className="text-xs font-semibold text-brand-purple">{c.authorName}</p>
                <p className="text-sm text-brand-purple/80">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="shrink-0 flex items-center gap-2 border-t border-brand-purple/10 px-4 py-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <input
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Napísať komentár…"
            className="flex-1 rounded-pill bg-brand-purple/8 px-4 py-2.5 text-sm text-brand-purple placeholder-brand-purple/40 outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!body.trim() || pending}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-pink text-white disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
