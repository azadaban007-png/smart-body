import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SearchPanel } from "@/components/search/SearchPanel";
import { HERO } from "@/config/site";

const ease = [0.22, 1, 0.36, 1];
const rise = (delay) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } });

const Suggestions = () => (
  <div className="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-sm">
    <span className="shrink-0 text-white/60">جستجوهای پیشنهادی:</span>
    {HERO.suggestions.map((s) => (
      <Link
        key={s.q}
        to={`/search?${new URLSearchParams({ city: s.city, q: s.q })}`}
        data-testid={`hero-suggestion-${s.q.replace(/\s+/g, "-")}`}
        className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-white/90 backdrop-blur transition-colors duration-300 hover:bg-white/20"
      >
        {s.q}، {s.city}
      </Link>
    ))}
  </div>
);

export const Hero = () => (
  <section id="home" data-testid="hero-section" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-sb-ink lg:min-h-[94vh]">
    <img src={HERO.image} alt="ورزشکار در حال تمرین در باشگاه" className="sb-hero-img absolute inset-0 -z-20 h-full w-full object-cover object-[25%_center]" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-l from-sb-ink/95 via-sb-ink/65 to-sb-ink/15 dark:via-sb-ink/75 dark:to-sb-ink/40" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-sb-ink/90 to-transparent" />

    <div className="sb-container w-full pb-12 pt-32 sm:pb-16 lg:pb-20">
      <div className="max-w-3xl text-white">
        <motion.p {...rise(0.1)} className="sb-hero-glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold" data-testid="hero-eyebrow">
          <span className="sb-pulse-dot h-2 w-2 rounded-full bg-sb-cyan" />
          {HERO.eyebrow}
        </motion.p>
        <motion.h1 {...rise(0.22)} className="mt-6 text-4xl font-black leading-[1.25] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.2]" data-testid="hero-title">
          {HERO.titleLead}
          <br />
          <span className="sb-text-gradient">{HERO.titleAccent}</span>
        </motion.h1>
        <motion.p {...rise(0.34)} className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg" data-testid="hero-description">
          {HERO.description}
        </motion.p>
      </div>
      <motion.div {...rise(0.48)} className="mt-10 max-w-5xl">
        <SearchPanel testId="hero-search-panel" />
        <Suggestions />
      </motion.div>
    </div>
  </section>
);
