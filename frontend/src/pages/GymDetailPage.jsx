import { Link, useParams } from "react-router-dom";
import { ArrowRight, ExternalLink, MapPin, Phone, Sparkles } from "lucide-react";
import { getGym, getGyms } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { useHScroll } from "@/hooks/useHScroll";
import { GymCard, RatingPill } from "@/components/gym/GymCard";
import { ScrollControls, ScrollTrack } from "@/components/common/HScroll";
import { toFa } from "@/lib/format";

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-sb-border py-3.5 last:border-0">
    <span className="text-sm text-sb-muted">{label}</span>
    <span className="text-left text-sm font-semibold text-sb-text">{value}</span>
  </div>
);

const RelatedGyms = ({ gym }) => {
  const { data } = useAsync(() => getGyms({ city: gym.city }), [gym.slug]);
  const others = (data || []).filter((g) => g.slug !== gym.slug);
  const scroller = useHScroll(others.length);
  if (!others.length) return null;
  return (
    <section className="border-t border-sb-border py-16" data-testid="related-gyms">
      <div className="sb-container mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold text-sb-text">باشگاه‌های دیگر در {gym.city}</h2>
        <ScrollControls scroller={scroller} testIdPrefix="related-gyms" />
      </div>
      <ScrollTrack ref={scroller.ref} label="باشگاه‌های مرتبط" className="gap-4 pb-4">
        {others.map((g) => <div role="listitem" key={g.slug} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[28%]"><GymCard gym={g} /></div>)}
      </ScrollTrack>
    </section>
  );
};

export default function GymDetailPage() {
  const { slug } = useParams();
  const { data: gym, loading, error } = useAsync(() => getGym(slug), [slug]);

  if (loading) return <div className="sb-container pt-32"><div className="aspect-[21/9] animate-pulse rounded-[2rem] bg-sb-surface2" /></div>;
  if (error || !gym) {
    return (
      <div className="sb-container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center" data-testid="gym-not-found">
        <h1 className="text-3xl font-black text-sb-text">باشگاه پیدا نشد</h1>
        <Link to="/search" className="sb-btn-primary mt-6 h-12 px-6">مشاهده همه باشگاه‌ها</Link>
      </div>
    );
  }

  return (
    <article data-testid="gym-detail-page">
      <div className="sb-container pt-28 sm:pt-32">
        <Link to="/search" data-testid="gym-back-link" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sb-muted transition-colors hover:text-sb-primary">
          <ArrowRight className="h-4 w-4" /> بازگشت به باشگاه‌ها
        </Link>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-sb-ink">
          <img src={gym.image} alt={gym.name} className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sb-ink via-sb-ink/40 to-transparent" />
          <div className="flex min-h-[360px] flex-col justify-end p-6 text-white sm:min-h-[460px] sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              {gym.badge && <span className="sb-hero-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"><Sparkles className="h-3.5 w-3.5 text-sb-cyan" />{gym.badge}</span>}
              <RatingPill rating={gym.rating} className="sb-hero-glass" />
            </div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl" data-testid="gym-detail-name">{gym.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-white/80"><MapPin className="h-4 w-4 text-sb-cyan" />{gym.city}، {gym.neighborhood}</p>
          </div>
        </div>
      </div>

      <div className="sb-container grid gap-10 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="text-xl font-extrabold text-sb-text">درباره باشگاه</h2>
          <p className="mt-4 text-base leading-8 text-sb-muted md:text-lg" data-testid="gym-detail-description">{gym.description}</p>
          <h2 className="mt-10 text-xl font-extrabold text-sb-text">رشته‌های ورزشی</h2>
          <div className="mt-4 flex flex-wrap gap-3" data-testid="gym-detail-sports">
            {gym.sports.map((s) => (
              <Link key={s.slug} to={`/search?sport=${s.slug}`} className="group flex items-center gap-3 rounded-2xl border border-sb-border bg-sb-surface p-2 pe-5 transition-colors hover:border-sb-primary">
                <img src={s.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="font-semibold text-sb-text">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-[1.75rem] border border-sb-border bg-sb-surface p-6 lg:sticky lg:top-28">
          <InfoRow label="شهر" value={gym.city} />
          <InfoRow label="محله" value={gym.neighborhood} />
          <InfoRow label="آدرس" value={gym.address} />
          <InfoRow label="امتیاز" value={`${toFa(gym.rating)} از ۵`} />
          <a href={`tel:${gym.phone.replace(/-/g, "")}`} data-testid="gym-call-button" className="sb-btn-primary mt-6 h-13 w-full py-3.5">
            <Phone className="h-4 w-4" /> تماس با باشگاه <span dir="ltr" className="font-medium opacity-80">{toFa(gym.phone)}</span>
          </a>
          {gym.landingPageUrl && (
            <a href={gym.landingPageUrl} target="_blank" rel="noopener noreferrer" data-testid="gym-landing-link" className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-sb-border font-bold text-sb-text hover:border-sb-primary">
              صفحه اختصاصی باشگاه <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </aside>
      </div>
      <RelatedGyms gym={gym} />
    </article>
  );
}
