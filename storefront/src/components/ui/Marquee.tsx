import type { ReactNode } from "react";
import styles from "./Marquee.module.css";

interface Props {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
  className = "",
}: Props) {
  return (
    <div
      className={`${styles.marquee} ${className}`}
      data-pause={pauseOnHover}
      data-reverse={reverse}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className={styles.track}>
        <div className={styles.line}>{children}</div>
        <div className={styles.line} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
