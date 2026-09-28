import { useCatalog } from "@/context/CatalogContext";

const chip = "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300";
const on = "border-sb-primary bg-sb-primary text-white";
const off = "border-sb-border bg-sb-surface text-sb-muted hover:border-sb-primary/50 hover:text-sb-text";

export const SportFilter = ({ value, onChange }) => {
  const { sports } = useCatalog();
  return (
    <div role="group" aria-label="فیلتر رشته ورزشی" className="no-scrollbar -mx-[var(--sb-pad)] flex gap-2 overflow-x-auto px-[var(--sb-pad)] pb-1" data-testid="sport-filter">
      <button type="button" aria-pressed={!value} onClick={() => onChange("")} data-testid="sport-filter-all" className={`${chip} ${!value ? on : off}`}>
        همه رشته‌ها
      </button>
      {sports.map((s) => (
        <button key={s.slug} type="button" aria-pressed={value === s.slug} onClick={() => onChange(s.slug)} data-testid={`sport-filter-${s.slug}`} className={`${chip} ${value === s.slug ? on : off}`}>
          {s.name}
        </button>
      ))}
    </div>
  );
};
