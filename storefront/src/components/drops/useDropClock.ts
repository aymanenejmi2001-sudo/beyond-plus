"use client";
import { useEffect, useState } from "react";

// Current time for drop status, refreshed every 30 s (the countdown shows
// minutes, not seconds). `?preview_at=<ISO>` simulates another moment for QA.
export function useDropClock(serverNow: number) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    let offset = 0;
    try {
      const at = new URLSearchParams(window.location.search).get("preview_at");
      const t = at ? Date.parse(at) : NaN;
      if (!Number.isNaN(t)) offset = t - Date.now();
    } catch { /* no URL access */ }
    const tick = () => setNow(Date.now() + offset);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
