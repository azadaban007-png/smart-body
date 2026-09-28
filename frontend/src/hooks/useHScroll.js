import { useCallback, useEffect, useRef, useState } from "react";

// RTL-aware horizontal scroller state: exposes edges + prev/next paging.
export const useHScroll = (dep) => {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pos = Math.abs(el.scrollLeft);
      setEdge({ atStart: pos < 8, atEnd: pos > max - 8 });
    };
    el.scrollTo({ left: 0 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [dep]);

  const page = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const amount = el.clientWidth * 0.8 * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: rtl ? -amount : amount, behavior: "smooth" });
  }, []);

  return { ref, ...edge, next: () => page("next"), prev: () => page("prev") };
};
