import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "invert"
  | "outline"
  | "editorial"
  | "text";

interface BaseProps {
  variant?: ButtonVariant;
  block?: boolean;
  children: ReactNode;
  /** Text used for the rolling duplicate label. Defaults to `children` when it is a string. */
  label?: string;
  icon?: ReactNode;
  className?: string;
}

function inner(children: ReactNode, label: string | undefined, icon: ReactNode) {
  const text = label ?? (typeof children === "string" ? children : undefined);
  return (
    <span className={styles.content}>
      {icon}
      <span className={styles.label}>
        {children}
        {text && <span className={styles.duplicate} aria-hidden="true">{text}</span>}
      </span>
    </span>
  );
}

type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  block,
  children,
  label,
  icon,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      aria-label={rest["aria-label"] ?? label ?? (typeof children === "string" ? children : undefined)}
      className={`${styles.button} ${styles[variant]} ${block ? styles.block : ""} ${className}`}
    >
      {inner(children, label, icon)}
    </button>
  );
}

type LinkButtonProps = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "children" | "className" | "href"
  >;

export function LinkButton({
  variant = "primary",
  block,
  children,
  label,
  icon,
  className = "",
  href,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      {...rest}
      href={href}
      aria-label={rest["aria-label"] ?? label ?? (typeof children === "string" ? children : undefined)}
      className={`${styles.button} ${styles[variant]} ${block ? styles.block : ""} ${className}`}
    >
      {inner(children, label, icon)}
    </Link>
  );
}
