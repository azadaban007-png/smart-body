import { Check } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";

export const SportsPicker = ({ value, onChange, labelId }) => {
  const { sports } = useCatalog();
  const toggle = (slug) => onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2" data-testid="register-sports-picker">
      {sports.map((s) => {
        const active = value.includes(s.slug);
        return (
          <button
            key={s.slug}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(s.slug)}
            data-testid={`register-sport-${s.slug}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              active ? "border-sb-primary bg-sb-primary text-white" : "border-sb-border bg-sb-surface text-sb-muted hover:border-sb-primary/50 hover:text-sb-text"
            }`}
          >
            {active && <Check className="h-4 w-4" />}
            {s.name}
          </button>
        );
      })}
    </div>
  );
};
