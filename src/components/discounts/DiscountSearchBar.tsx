"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { fetchDiscountSearchHintsAction } from "@/lib/actions/discount-search";
import { profileAvatarStyle } from "@/lib/avatar-style";

type Hint = {
  handle: string;
  name: string;
  avatarUrl: string | null;
  category: string;
};

export function DiscountSearchBar({
  defaultQuery = "",
  action = "/home/zlavy",
  categorySlug,
}: {
  defaultQuery?: string;
  action?: string;
  /** When set, hints are limited to this category page's scope. */
  categorySlug?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [hints, setHints] = useState<Hint[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const loadHints = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      setHints([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    startTransition(() => {
      void fetchDiscountSearchHintsAction({ query: trimmed, categorySlug }).then(
        (res) => {
          if (res.ok) setHints(res.hints);
          setLoading(false);
        },
      );
    });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadHints(value), 200);
  };

  const goToBrand = (handle: string) => {
    setOpen(false);
    router.push(`/home/zlavy/${handle}`);
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <form
      action={action}
      method="get"
      className="px-5 pb-3 pt-1"
      onSubmit={() => setOpen(false)}
    >
      <div ref={rootRef} className="relative">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) {
              setOpen(true);
              loadHints(query);
            }
          }}
          placeholder="Hľadať"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={showPanel ? listId : undefined}
          aria-expanded={showPanel}
          className="forum-search"
        />
        <button
          type="submit"
          aria-label="Hľadať"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-purple/50"
        >
          <SearchIcon />
        </button>

        {showPanel && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-2xl border border-brand-purple/10 bg-white py-1 shadow-card"
          >
            {loading && hints.length === 0 && (
              <li className="px-4 py-3 text-sm text-brand-purple/50">
                Hľadám…
              </li>
            )}
            {!loading && hints.length === 0 && (
              <li className="px-4 py-3 text-sm text-brand-purple/50">
                Nenašli sme žiadne značky.
              </li>
            )}
            {hints.map((hint) => (
              <li key={hint.handle} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => goToBrand(hint.handle)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-brand-purple/5"
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
                    style={profileAvatarStyle(hint.avatarUrl)}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-brand-purple">
                      {hint.name}
                    </span>
                    <span className="block text-[11px] text-brand-purple/55">
                      {hint.category}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {!loading && hints.length > 0 && (
              <li className="border-t border-brand-purple/8 px-3 py-2">
                <Link
                  href={`${action}?q=${encodeURIComponent(query.trim())}`}
                  className="block text-center text-xs font-semibold text-brand-purple/70 hover:text-brand-purple"
                  onClick={() => setOpen(false)}
                >
                  Zobraziť všetky výsledky
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
