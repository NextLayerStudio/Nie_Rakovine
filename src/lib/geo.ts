function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two lat/lng points, in kilometres. */
export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371; // Earth radius (km)
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function hasCoords(p: {
  latitude?: number | null;
  longitude?: number | null;
}): p is { latitude: number; longitude: number } {
  return typeof p.latitude === "number" && typeof p.longitude === "number";
}

/** Distance in km from a user point to an event, or null if either lacks coords. */
export function distanceKm(
  from: { latitude?: number | null; longitude?: number | null },
  to: { latitude?: number | null; longitude?: number | null },
): number | null {
  if (!hasCoords(from) || !hasCoords(to)) return null;
  return haversineKm(from.latitude, from.longitude, to.latitude, to.longitude);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
