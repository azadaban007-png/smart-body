import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useHScroll } from "@/hooks/useHScroll";
import { ScrollControls, ScrollTrack } from "@/components/common/HScroll";

const itemClass = "group flex w-[112px] shrink-0 snap-start flex-col items-center gap-3 sm:w-[132px]";
const thumbClass = "relative aspect-square w-full overflow-hidden rounded-[1.4rem] ring-1 ring-sb-border transition-[box-shadow,transform] duration-500 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-sb-cyan";

const SportItem = ({ sport }) => (
  <Link role="listitem" to={`/search?sport=${sport.slug}`} data-testid={`sport-item-${sport.slug}`} className={itemClass}>
    <span className={thumbClass}>
      <img src={sport.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <span className="absolute inset-0 bg-gradient-to-t from-sb-ink/50 to-transparent" />
    </span>
    <span className="text-sm font-semibold text-sb-text">{sport.name}</span>
  </Link>
);

export const SportsStrip = () => {
  const { sports } = useCatalog();
  const featured = sports.filter((s) => s.featured);
  const scroller = useHScroll(featured.length);

  return (
    <section id="sports" aria-labelledby="sports-title" data-testid="sports-strip" className="scroll-mt-24 border-b border-sb-border py-12 md:py-14">
      <div className="sb-container mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="sb-eyebrow mb-2">رشته‌های ورزشی</p>
          <h2 id="sports-title" className="text-xl font-extrabold text-sb-text sm:text-2xl">رشته ورزشی‌ات را انتخاب کن</h2>
        </div>
        <ScrollControls scroller={scroller} testIdPrefix="sports-strip" />
      </div>
      <ScrollTrack ref={scroller.ref} label="رشته‌های ورزشی" testId="sports-strip-track" className="gap-4 pb-2 sm:gap-5 sm:snap-proximity">
        {featured.map((sport) => <SportItem key={sport.slug} sport={sport} />)}
        <Link role="listitem" to="/search" data-testid="sport-item-other" className={itemClass}>
          <span className={`${thumbClass} grid place-items-center bg-gradient-to-br from-sb-primary to-sb-cyan`}>
            <LayoutGrid className="h-8 w-8 text-white transition-transform duration-500 group-hover:scale-110" />
          </span>
          <span className="text-sm font-semibold text-sb-text">سایر رشته‌ها</span>
        </Link>
      </ScrollTrack>
    </section>
  );
};
