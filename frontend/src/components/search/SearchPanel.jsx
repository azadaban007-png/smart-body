import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Search } from "lucide-react";
import { CityCombobox } from "@/components/common/CityCombobox";

const FieldShell = ({ icon: Icon, children }) => (
  <div className="sb-field flex min-h-[68px] items-center gap-3 px-3.5 py-2.5">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sb-primary/10 text-sb-primary dark:text-sb-cyan">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

export const SearchPanel = ({ initialCity = "", initialQuery = "", testId = "search-panel" }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialCity);
  const [q, setQ] = useState(initialQuery);
  const [error, setError] = useState("");

  useEffect(() => {
    setCity(initialCity);
    setQ(initialQuery);
  }, [initialCity, initialQuery]);

  const submit = (e) => {
    e.preventDefault();
    if (!city) return setError("لطفاً ابتدا شهر موردنظر را انتخاب کنید.");
    const params = new URLSearchParams({ city });
    if (q.trim()) params.set("q", q.trim());
    return navigate(`/search?${params}`);
  };

  return (
    <form onSubmit={submit} role="search" aria-label="جستجوی باشگاه" data-testid={testId} className="sb-glass rounded-[1.75rem] p-2 shadow-[var(--sb-shadow)] sm:p-2.5">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]">
        <FieldShell icon={MapPin}>
          <span id={`${testId}-city-label`} className="mb-0.5 block text-xs font-semibold text-sb-muted">انتخاب شهر ایران</span>
          <CityCombobox value={city} onChange={(c) => { setCity(c); setError(""); }} labelId={`${testId}-city-label`} testId="search-city-select" className="h-7 text-[0.95rem]" />
        </FieldShell>
        <FieldShell icon={Navigation}>
          <label htmlFor={`${testId}-location`} className="mb-0.5 block text-xs font-semibold text-sb-muted">خیابان، محله یا محدوده</label>
          <input
            id={`${testId}-location`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="خیابان، محله یا محدوده را وارد کنید"
            data-testid="search-location-input"
            className="h-7 w-full bg-transparent text-[0.95rem] font-semibold text-sb-text outline-none placeholder:font-normal placeholder:text-sb-muted"
          />
        </FieldShell>
        <button type="submit" data-testid="search-submit-button" className="sb-btn-primary h-14 rounded-[1.25rem] px-8 text-base md:h-auto">
          <Search className="h-5 w-5" />
          جستجو
        </button>
      </div>
      {error && (
        <p role="alert" data-testid="search-error" className="px-4 pb-1 pt-2.5 text-sm font-medium text-rose-500">{error}</p>
      )}
    </form>
  );
};
