export type LibraryKind = "audio" | "clanky" | "video" | "novinky";
export type LibrarySort = "newest" | "oldest";

export const LIBRARY_KINDS: LibraryKind[] = [
  "audio",
  "clanky",
  "video",
  "novinky",
];

export function parseLibraryKind(value: string | null): LibraryKind | null {
  return LIBRARY_KINDS.includes(value as LibraryKind)
    ? (value as LibraryKind)
    : null;
}

export const KNIZNICA_SCROLL_KEY = "kniznica-scroll";
