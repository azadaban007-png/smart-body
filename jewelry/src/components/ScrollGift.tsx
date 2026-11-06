import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const FRAMES = Array.from(
  { length: 9 },
  (_, i) => `/hero-gift/frame-${i.toString().padStart(2, "0")}.webp`,
);

// Magical chime notes — one per frame transition (C major pentatonic, airy)
const CHIME_FREQS = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1396.91];

/** Play a single soft bell tone via Web Audio API. */
function playChime(audioCtx: AudioContext, freq: number, gain: number) {
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  // Envelope: quick attack, long decay — bell-like
  const now = audioCtx.currentTime;
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(gain, now + 0.02);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  // Add a second oscillator for richness (harmonic)
  const osc2 = audioCtx.createOscillator();
  const osc2Gain = audioCtx.createGain();
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2;
  osc2Gain.gain.setValueAtTime(0, now);
  osc2Gain.gain.linearRampToValueAtTime(gain * 0.3, now + 0.02);
  osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

  osc.connect(oscGain).connect(audioCtx.destination);
  osc2.connect(osc2Gain).connect(audioCtx.destination);
  osc.start(now);
  osc2.start(now);
  osc.stop(now + 1.3);
  osc2.stop(now + 0.9);
}

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
 *
 * A subtle magical chime plays on each frame change, and the hero background
 * uses a blurred frame so the page matches the gift's environment.
 */
export function ScrollGift({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastChimeFrameRef = useRef(-1);

  // Initialise audio context on first user interaction (scroll)
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

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

        // Play a chime on each frame advance (not on reverse scrubs within same frame)
        if (idx > lastChimeFrameRef.current) {
          const ctx = ensureAudio();
          if (ctx) {
            playChime(ctx, CHIME_FREQS[idx], 0.06);
          }
        }
        lastChimeFrameRef.current = idx;
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
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Pinned visual — stays in viewport while the tall section scrolls */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Blurred frame as background — matches the gift's environment */}
        <img
          src={FRAMES[0]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(30px) brightness(0.5)", transform: "scale(1.1)" }}
        />
        {/* Foreground frames — object-contain so the full box is visible */}
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: i === active ? 1 : 0,
              willChange: "opacity",
              transform: "scale(0.8)",
            }}
          />
        ))}
        {/* darken slightly so overlay text stays legible */}
        <div className="absolute inset-0 bg-background/30" />
        {/* Shine overlay — intensifies as the box opens (scroll progresses) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(197,160,89,0.25) 0%, transparent 70%)",
            opacity: 0.3 + (active / (FRAMES.length - 1)) * 0.5,
            willChange: "opacity",
          }}
        />
        {/* Moving light sweep — diagonal shine that shifts with scroll */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ willChange: "opacity" }}
        >
          <div
            className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-15deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,245,220,0.15) 50%, transparent 100%)",
              transform: `translateX(${(active / (FRAMES.length - 1)) * 400}%)`,
              opacity: active > 0 && active < FRAMES.length - 1 ? 1 : 0,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
