"use client";

// "04D 06H 21M", minutes precision. Hidden from screen readers (the launch date
// is announced once in plain text next to it) so nothing is read out each tick.
export function Countdown({ launchAt, now, className }: { launchAt: string; now: number; className?: string }) {
  const ms = Date.parse(launchAt) - now;
  if (!(ms > 0)) return null;
  const m = Math.floor(ms / 60_000);
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return <span className={className} aria-hidden="true">{pad(d)}D {pad(h)}H {pad(min)}M</span>;
}
