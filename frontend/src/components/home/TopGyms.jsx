import { Link } from "react-router-dom";
import { getGyms } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { useHScroll } from "@/hooks/useHScroll";
import { GymCard } from "@/components/gym/GymCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollControls, ScrollTrack } from "@/components/common/HScroll";
import { Reveal } from "@/components/common/Reveal";

const cardWidth = "w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.6%]";

export const TopGyms = () => {
  const { data: gyms, loading, error } = useAsync(() => getGyms({ limit: 8 }), []);
  const scroller = useHScroll(gyms?.length);

  return (
    <section id="gyms" aria-labelledby="top-gyms-title" data-testid="top-gyms-section" className="scroll-mt-24 py-20 md:py-28">
      <Reveal className="sb-container mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="top-gyms-title" eyebrow="منتخب ورزشکاران" title="باشگاه‌های برتر" subtitle="باشگاه‌های ثبت‌شده در بدن هوشمند" />
        <div className="flex items-center gap-4">
          <Link to="/search" data-testid="top-gyms-view-all" className="text-sm font-bold text-sb-primary transition-colors hover:text-sb-deep dark:hover:text-sb-cyan">
            مشاهده همه ←
          </Link>
          <ScrollControls scroller={scroller} testIdPrefix="top-gyms" />
        </div>
      </Reveal>
      {error && <p className="sb-container text-sb-muted" data-testid="top-gyms-error">بارگذاری باشگاه‌ها با مشکل مواجه شد.</p>}
      <ScrollTrack ref={scroller.ref} label="باشگاه‌های برتر" testId="top-gyms-track" className="gap-4 pb-6 sm:gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={`${cardWidth} aspect-[4/5] animate-pulse rounded-[1.75rem] bg-sb-surface2`} />)
          : gyms?.map((gym) => (
              <div role="listitem" key={gym.slug} className={cardWidth}>
                <GymCard gym={gym} />
              </div>
            ))}
      </ScrollTrack>
    </section>
  );
};
