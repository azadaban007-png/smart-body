import { Link, useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { getGyms } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { useCatalog } from "@/context/CatalogContext";
import { SearchPanel } from "@/components/search/SearchPanel";
import { SportFilter } from "@/components/search/SportFilter";
import { GymResultItem } from "@/components/gym/GymResultItem";
import { toFa } from "@/lib/format";

const EmptyState = ({ city, q }) => (
  <div data-testid="search-empty-state" className="flex flex-col items-center rounded-[2rem] border border-dashed border-sb-border bg-sb-surface px-6 py-16 text-center">
    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sb-primary/10 text-sb-primary"><SearchX className="h-7 w-7" /></span>
    <h2 className="mt-5 text-xl font-bold text-sb-text">باشگاهی در این محدوده پیدا نشد</h2>
    <p className="mt-2 max-w-md text-sb-muted">محدوده دیگری را امتحان کن یا همه باشگاه‌های ثبت‌شده را ببین.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {city && q && <Link to={`/search?city=${encodeURIComponent(city)}`} data-testid="search-empty-city-link" className="sb-btn-primary h-11 px-5 text-sm">همه باشگاه‌های {city}</Link>}
      <Link to="/search" data-testid="search-empty-all-link" className="inline-flex h-11 items-center rounded-full border border-sb-border px-5 text-sm font-bold text-sb-text transition-colors hover:border-sb-primary">مشاهده همه باشگاه‌ها</Link>
    </div>
  </div>
);

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const city = params.get("city") || "";
  const q = params.get("q") || "";
  const sport = params.get("sport") || "";
  const { sports } = useCatalog();
  const { data: gyms, loading, error } = useAsync(() => getGyms({ city, q, sport }), [city, q, sport]);

  const setSport = (slug) => {
    const next = new URLSearchParams(params);
    slug ? next.set("sport", slug) : next.delete("sport");
    setParams(next);
  };
  const sportName = sports.find((s) => s.slug === sport)?.name;
  const title = city ? (q ? `باشگاه‌های نزدیک ${q}، ${city}` : `باشگاه‌های ${city}`) : sportName ? `باشگاه‌های ${sportName}` : "همه باشگاه‌ها";

  return (
    <div data-testid="search-page">
      <section className="relative overflow-hidden border-b border-sb-border bg-sb-surface pb-8 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute -top-32 left-0 h-72 w-72 rounded-full bg-sb-cyan/15 blur-[100px]" />
        <div className="sb-container relative">
          <p className="sb-eyebrow mb-3">نتایج جستجو</p>
          <h1 className="text-3xl font-black leading-snug text-sb-text sm:text-4xl" data-testid="search-title">{title}</h1>
          <div className="mt-8"><SearchPanel initialCity={city} initialQuery={q} testId="results-search-panel" /></div>
          <div className="mt-6"><SportFilter value={sport} onChange={setSport} /></div>
        </div>
      </section>
      <section className="sb-container py-10 pb-24" aria-live="polite">
        {!loading && !error && (
          <p className="mb-6 text-sm font-semibold text-sb-muted" data-testid="search-results-count">{toFa(gyms.length)} باشگاه پیدا شد</p>
        )}
        {error && <p className="text-rose-500" data-testid="search-error-state">دریافت نتایج با مشکل مواجه شد. دوباره تلاش کنید.</p>}
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-[1.75rem] bg-sb-surface2" />)}</div>
        ) : gyms?.length ? (
          <div className="grid gap-4 lg:grid-cols-2" data-testid="search-results-list">{gyms.map((g) => <GymResultItem key={g.slug} gym={g} />)}</div>
        ) : (
          !error && <EmptyState city={city} q={q} />
        )}
      </section>
    </div>
  );
}
