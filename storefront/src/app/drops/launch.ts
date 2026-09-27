import { dropDate, type Drop } from "@/data/drops";
import type { LaunchInfo } from "@/components/drops/types";

export const launchInfo = (d: Drop): LaunchInfo | null =>
  d.kind === "drop" ? { launchAt: d.launchAt, dateLabel: dropDate(d), fixedStatus: d.status === "auto" ? null : d.status } : null;
