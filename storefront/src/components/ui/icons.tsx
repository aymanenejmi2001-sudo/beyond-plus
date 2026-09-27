/* Line icons at 1.3px stroke — matches the weight used by both references. */

interface IconProps { className?: string; size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  focusable: false as const,
});

export const CloseIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="7.2" cy="7.2" r="4.7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10.8 10.8L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const MenuIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2 4.5h12M2 11.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9.5 3L4.5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ size = 12, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const CartIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path
      d="M3.1 4.9h9.8l.9 8.1a.5.5 0 0 1-.5.55H2.7a.5.5 0 0 1-.5-.55l.9-8.1Z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
    />
    <path d="M5.6 4.9V4a2.4 2.4 0 0 1 4.8 0v.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const ShippingIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable={false} className={className}>
    <path d="M1.5 6.5h11v9h-11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12.5 9.5h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="6" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="16.5" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const ReturnIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable={false} className={className}>
    <path d="M4 10a8 8 0 1 1 1.2 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3 5.5V10h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SecureIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable={false} className={className}>
    <rect x="4.5" y="10" width="15" height="9.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const HeartIcon = ({ size = 16, className, filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...base(size)} className={className}>
    <path d="M8 13.5S2 9.9 2 5.9A3 3 0 0 1 8 4.6a3 3 0 0 1 6 1.3c0 4-6 7.6-6 7.6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill={filled ? "currentColor" : "none"} />
  </svg>
);
