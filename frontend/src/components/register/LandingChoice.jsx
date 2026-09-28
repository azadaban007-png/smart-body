import { Check, LayoutTemplate, X } from "lucide-react";

const OPTIONS = [
  { value: true, label: "بله", text: "کارشناسان بدن هوشمند برای طراحی لندینگ پیج با شما تماس می‌گیرند.", icon: LayoutTemplate, testId: "landing-choice-yes" },
  { value: false, label: "خیر", text: "فعلاً فقط در فهرست باشگاه‌های بدن هوشمند نمایش داده شود.", icon: X, testId: "landing-choice-no" },
];

export const LandingChoice = ({ value, onChange, labelId, invalid }) => (
  <div role="radiogroup" aria-labelledby={labelId} className="grid gap-3 sm:grid-cols-2">
    {OPTIONS.map((o) => {
      const active = value === o.value;
      const Icon = o.icon;
      return (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(o.value)}
          data-testid={o.testId}
          className={`relative flex items-start gap-3 rounded-2xl border p-4 text-right transition-[border-color,background-color,box-shadow] duration-300 ${
            active ? "border-sb-primary bg-sb-primary/5 shadow-[0_0_0_4px_rgba(21,151,229,0.12)]" : invalid ? "border-rose-400 bg-sb-surface" : "border-sb-border bg-sb-surface hover:border-sb-primary/50"
          }`}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-sb-primary text-white" : "bg-sb-surface2 text-sb-muted"}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-bold text-sb-text">{o.label}</span>
            <span className="mt-1 block text-xs leading-6 text-sb-muted">{o.text}</span>
          </span>
          {active && <Check className="absolute left-4 top-4 h-4 w-4 text-sb-primary" />}
        </button>
      );
    })}
  </div>
);
