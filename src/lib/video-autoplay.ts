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
  el.muted = true;
  el.play().catch(() => {
    // Autoplay can still be blocked (e.g. low-power mode) — nothing to do,
    // the poster frame / first video frame just stays visible.
  });
}
