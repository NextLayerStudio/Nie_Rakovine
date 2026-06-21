"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { fetchCalendarTabAction } from "@/lib/actions/tabs";

type CalendarData = Awaited<ReturnType<typeof fetchCalendarTabAction>> & { ok: true };

function TabSkeleton() {
  return (
    <div className="animate-pulse px-4 py-4 space-y-4">
      <div className="h-8 w-48 rounded-full bg-brand-purple/10 mx-auto" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-brand-purple/8" />
        ))}
      </div>
    </div>
  );
}

export function CalendarTabPanel({ initialData }: { initialData?: CalendarData }) {
  const [data, setData] = useState<CalendarData | null>(initialData ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (initialData) return;
    fetchCalendarTabAction()
      .then((res) => {
        if (res.ok) setData(res as CalendarData);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed)
    return (
      <div className="px-5 py-8 text-center text-sm text-brand-purple/50">
        Obsah sa nepodarilo načítať. Skúste obnoviť stránku.
      </div>
    );
  if (!data) return <TabSkeleton />;

  return (
    <CalendarView
      events={data.events}
      hasLocation={data.hasLocation}
      radiusKm={data.radiusKm}
      defaultName={data.defaultName}
      defaultSurname={data.defaultSurname}
    />
  );
}
