/**
 * Mobile browsers (iOS Safari especially) only allow a <video> to autoplay
 * without a user gesture if it's actually muted at the moment playback is
 * requested — React's `muted` JSX prop doesn't reliably set the underlying
 * DOM property in time on first render/hydration, so autoplay silently
 * fails on phones even though it works fine on desktop. Setting `.muted`
 * imperatively via this ref callback and kicking off `.play()` ourselves
 * fixes it.
 */
export function ensureAutoplay(el: HTMLVideoElement | null): void {
  if (!el) return;
  // Same JSX-prop-vs-DOM-property timing gap can affect playsInline/autoplay
  // too, not just muted — WebKit (Safari and, since it wraps the same
  // engine, Chrome on iOS) is the strictest about all three being set.
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.autoplay = true;
  if (el.readyState === 0) el.load();
  el.play().catch(() => {
    // Autoplay can still be blocked (e.g. iOS Low Data Mode, low-power
    // mode) — nothing to do, the poster frame / first video frame just
    // stays visible.
  });
}
