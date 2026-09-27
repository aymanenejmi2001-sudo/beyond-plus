import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./EditorialLink.module.css";

const Arrow = () => (
  <svg
    className={styles.arrow}
    width="14"
    height="10"
    viewBox="0 0 14 10"
    fill="none"
    aria-hidden
    focusable={false}
  >
    <path d="M0 5h12M8.5 1.2 12.3 5 8.5 8.8" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

interface Props extends Omit<ComponentPropsWithoutRef<"a">, "href" | "className"> {
  href: string;
  children: ReactNode;
  /** white treatment for links sitting on photography */
  onImage?: boolean;
  className?: string;
}

export function EditorialLink({ href, children, onImage, className = "", ...rest }: Props) {
  return (
    <Link
      {...rest}
      href={href}
      className={`${styles.link} ${onImage ? styles.onImage : ""} ${className}`}
    >
      {children}
      <Arrow />
    </Link>
  );
}
