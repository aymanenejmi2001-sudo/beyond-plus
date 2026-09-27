"use client";
import { useEffect, useState } from "react";

// Current time for drop status, refreshed every 30 s (the countdown shows
// minutes). `?preview_at=<ISO>` simulates another moment, for QA only: it is
// ignored on the public site and works only on localhost or a Vercel preview.
function previewAllowed() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
}

export function useDropClock(serverNow: number) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    let offset = 0;
    try {
      if (previewAllowed()) {
        const t = Date.parse(new URLSearchParams(window.location.search).get("preview_at") ?? "");
        if (!Number.isNaN(t)) offset = t - Date.now();
      }
    } catch { /* no URL access */ }
    const tick = () => setNow(Date.now() + offset);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
