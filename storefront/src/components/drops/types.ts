import type { DropStatus } from "@/data/drops-config";
/** Present only for a real drop (kind "drop"); an edit has no launch. */
export interface LaunchInfo { launchAt: string; dateLabel: string; fixedStatus: DropStatus | null }
export type ShownStatus = DropStatus | "available";
export function statusAt(launch: LaunchInfo | null, now: number): ShownStatus {
  if (!launch) return "available";
  return launch.fixedStatus ?? (now >= Date.parse(launch.launchAt) ? "live" : "upcoming");
}
export const STATUS_LABEL: Record<ShownStatus, string> = { available: "AVAILABLE NOW", upcoming: "COMING SOON", live: "LIVE", archived: "ARCHIVE" };
