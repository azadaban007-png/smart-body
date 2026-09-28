import { useId } from "react";

export const LogoMark = ({ size = 38 }) => {
  const gid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1597E5" />
          <stop offset="1" stopColor="#23B6C9" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gid})`} />
      <circle cx="26" cy="10.5" r="3.4" fill="#fff" />
      <path d="M9 26.5c4.2-.8 6.9-3.1 9.1-6.8l2.3-3.8 3.9 3.4 6.3-1.6" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.2 23.6l4.1 4-2.4 5.6" fill="none" stroke="#fff" strokeOpacity=".82" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Logo = ({ light = false, size = 38 }) => (
  <span className="inline-flex items-center gap-2.5">
    <LogoMark size={size} />
    <span className="flex flex-col leading-none">
      <span className={`text-[1.15rem] font-extrabold ${light ? "text-white" : "text-sb-text"}`}>بدن هوشمند</span>
      <span dir="ltr" className={`mt-1 text-[9px] font-semibold tracking-[0.32em] ${light ? "text-white/60" : "text-sb-muted"}`}>
        SMART BODY
      </span>
    </span>
  </span>
);
