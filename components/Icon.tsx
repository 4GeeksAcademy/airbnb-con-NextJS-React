import type { ReactNode } from "react";

export type IconName =
  | "search" | "user" | "menu" | "star" | "calendar" | "users" | "close" | "home"
  | "pin" | "wifi" | "pool" | "kitchen" | "parking" | "view" | "workspace"
  | "heat" | "garden" | "chevron-left" | "chevron-right" | "check";

const shapes: Record<IconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" /></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  wifi: <><path d="M5 9a11 11 0 0 1 14 0M8 12a6.5 6.5 0 0 1 8 0M11 15a2 2 0 0 1 2 0" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></>,
  pool: <><path d="M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2M5 14h14M7 14V6a2 2 0 1 1 4 0v2m6 6V5a2 2 0 1 1 4 0v3" /></>,
  kitchen: <><path d="M4 21h16M6 21V9h12v12M8 9V4m4 5V3m4 6V5" /></>,
  parking: <><circle cx="12" cy="12" r="9" /><path d="M10 17V7h4a3 3 0 0 1 0 6h-4" /></>,
  view: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  workspace: <><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M8 21h8m-4-3v3" /></>,
  heat: <><path d="M8 4c0 3-3 3-3 7a3 3 0 0 0 6 0c0-2-2-3-2-5m7-2c0 3-3 3-3 7a3 3 0 0 0 6 0c0-2-2-3-2-5M4 18h16" /></>,
  garden: <><path d="M12 21v-9m0 2C5 14 4 9 4 6c5 0 8 2 8 8Zm0-3c0-6 4-9 8-9 0 5-2 9-8 10" /></>,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </svg>
  );
}