"use client";

import { moodColor } from "@/lib/mood-options";

type MoodDay = { score: number; createdAt: string };

const DAYS = 30;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Compact 30-day strip — private to the member, matches contract's "len samotný člen". */
export function MoodHistoryCard({ entries }: { entries: MoodDay[] }) {
  if (entries.length === 0) return null;

  const byDay = new Map<string, number>();
  for (const e of entries) {
    byDay.set(dayKey(new Date(e.createdAt)), e.score);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    const key = dayKey(d);
    return { key, score: byDay.get(key) ?? null };
  });

  const avg = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;

  return (
    <div className="mx-4 mt-4 rounded-3xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-purple">
          Mood Meter — posledných 30 dní
        </h3>
        <span className="text-xs font-semibold text-brand-purple/50">
          priemer {avg.toFixed(1)}
        </span>
      </div>
      <div className="mt-3 flex gap-[3px] overflow-x-auto pb-1">
        {cells.map((c) => (
          <div
            key={c.key}
            title={c.key}
            className="h-6 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: c.score ? moodColor(c.score) : "#6F238014" }}
          />
        ))}
      </div>
    </div>
  );
}
