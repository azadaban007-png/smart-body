import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from(
  { length: 9 },
  (_, i) => `/hero-gift/frame-${i.toString().padStart(2, "0")}.webp`,
);

/**
 * Scroll-scrubbed reveal of the jewellery box gift.
 *
 * The section is 300 vh tall; the visual is pinned (sticky) to the viewport so
 * the 9-frame sequence plays smoothly across a long scroll distance — no jank.
 * Images are stacked and toggled by visibility (no CSS transition = instant,
 * lag-free frame switching).  All frames are eager-loaded so there is no
 * pop-in.
 *
 * Frame 0 (box closed) shows at the very top; the box fully opens by the time
 * the user has scrolled through the pinned region.  The rest of the site flows
 * naturally underneath once the pinned section ends.
 */
export function ScrollGift({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const frameRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const idx = Math.min(
        Math.floor(progress * FRAMES.length),
        FRAMES.length - 1,
      );
      if (idx !== frameRef.current) {
        frameRef.current = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Pinned visual — stays in viewport while the tall section scrolls */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: i === active ? 1 : 0,
              willChange: "opacity",
            }}
          />
        ))}
        {/* darken slightly so overlay text stays legible */}
        <div className="absolute inset-0 bg-background/30" />
        {children}
      </div>
    </div>
  );
}
