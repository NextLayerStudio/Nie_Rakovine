"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLng } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#e8e1d8] text-xs text-brand-purple/60">
      Načítavam mapu…
    </div>
  ),
});

// Geographic centre of Slovakia — sensible default before a point is set.
const SLOVAKIA_CENTER: LatLng = { lat: 48.669, lng: 19.699 };

type ReverseResult = { city: string | null; region: string | null };

async function reverseGeocode(p: LatLng): Promise<ReverseResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${p.lat}&lon=${p.lng}&accept-language=sk&zoom=12`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return { city: null, region: null };
    const data = await res.json();
    const a = data.address ?? {};
    const city =
      a.city || a.town || a.village || a.municipality || a.hamlet || null;
    const region = a.state || a.region || a.county || null;
    return { city, region };
  } catch {
    return { city: null, region: null };
  }
}

export function LocationPicker({
  defaultLat,
  defaultLng,
  onResolved,
  height = "h-64",
  showAddress = true,
}: {
  defaultLat?: number | null;
  defaultLng?: number | null;
  /** Called when a point is chosen + reverse-geocoded (for autofilling fields). */
  onResolved?: (data: { lat: number; lng: number } & ReverseResult) => void;
  height?: string;
  showAddress?: boolean;
}) {
  const [position, setPosition] = useState<LatLng | null>(
    typeof defaultLat === "number" && typeof defaultLng === "number"
      ? { lat: defaultLat, lng: defaultLng }
      : null,
  );
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolve = useCallback(
    (p: LatLng) => {
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = setTimeout(async () => {
        const geo = await reverseGeocode(p);
        const label = [geo.city, geo.region].filter(Boolean).join(", ");
        setAddress(label);
        onResolved?.({ lat: p.lat, lng: p.lng, ...geo });
      }, 400);
    },
    [onResolved],
  );

  const pick = useCallback(
    (p: LatLng) => {
      setPosition(p);
      setStatus("");
      resolve(p);
    },
    [resolve],
  );

  // Resolve initial point once (so parent fields can prefill).
  useEffect(() => {
    if (position) resolve(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolokácia nie je dostupná v tomto prehliadači.");
      return;
    }
    setStatus("Zisťujem polohu…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pick({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setStatus(
          "Polohu sa nepodarilo zistiť. Klepnite na mapu a označte miesto.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [pick]);

  return (
    <div>
      <input
        type="hidden"
        name="latitude"
        value={position?.lat ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name="longitude"
        value={position?.lng ?? ""}
        readOnly
      />

      <button
        type="button"
        onClick={useMyLocation}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-pill bg-brand-purple px-4 py-3.5 text-base font-bold text-white shadow-soft"
      >
        <LocateIcon />
        Použiť moju polohu
      </button>

      <div
        className={`relative ${height} w-full overflow-hidden rounded-3xl border border-brand-purple/10`}
      >
        <LeafletMap
          position={position}
          defaultCenter={SLOVAKIA_CENTER}
          onPick={pick}
        />
      </div>

      <p className="mt-2 text-center text-sm text-brand-purple/60">
        {status ||
          (position
            ? "Potiahnutím špendlíka alebo klepnutím upravte miesto."
            : "Klepnite na mapu alebo použite svoju polohu.")}
      </p>

      {showAddress && address && (
        <p className="mt-1 text-center text-sm font-semibold text-brand-purple">
          {address}
        </p>
      )}
    </div>
  );
}

function LocateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
