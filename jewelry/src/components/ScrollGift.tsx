import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FRAMES = Array.from({ length: 9 }, (_, i) => `/hero-gift/frame-${i.toString().padStart(2, "0")}.webp`);

/**
 * Scroll-scrubbed reveal of the jewellery box gift.
 * Frame 0 (box closed) at the top of the hero; the box opens as the user scrolls
 * one viewport down, and scrubs back when scrolling up — replaying each time.
 */
export function ScrollGift() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 0 when the hero sits at the top, 1 once it has scrolled one full height.
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      const idx = Math.round(progress * (FRAMES.length - 1));
      if (idx !== frameRef.current) {
        frameRef.current = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          loading="eager"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-100",
            i === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {/* darken slightly so overlay text stays legible */}
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
}
