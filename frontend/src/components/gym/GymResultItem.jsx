import { Link } from "react-router-dom";
import { ArrowUpLeft, MapPin } from "lucide-react";
import { RatingPill } from "@/components/gym/GymCard";

export const GymResultItem = ({ gym }) => (
  <Link
    to={`/gym/${gym.slug}`}
    data-testid={`gym-result-${gym.slug}`}
    className="group flex gap-4 rounded-[1.75rem] border border-sb-border bg-sb-surface p-3 transition-[transform,box-shadow,border-color,background-color] duration-500 hover:-translate-y-1 hover:border-sb-primary/40 hover:shadow-[var(--sb-card-shadow)] sm:gap-5"
  >
    <div className="relative w-28 shrink-0 overflow-hidden rounded-[1.25rem] sm:w-48">
      <img src={gym.image} alt={gym.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110" />
    </div>
    <div className="flex min-w-0 flex-1 flex-col py-1 sm:py-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-sb-text sm:text-lg">{gym.name}</h3>
        <RatingPill rating={gym.rating} className="shrink-0 bg-sb-surface2 text-sb-text" />
      </div>
      <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-6 text-sb-muted sm:text-sm">
        <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-sb-primary" />
        <span className="line-clamp-2">{gym.address}</span>
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {gym.sports.map((s) => (
            <span key={s.slug} className="rounded-full bg-sb-primary/10 px-2.5 py-1 text-[11px] font-semibold text-sb-deep dark:text-sb-cyan">{s.name}</span>
          ))}
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sb-border text-sb-text transition-[background-color,color,transform] duration-500 group-hover:-translate-x-1 group-hover:border-sb-primary group-hover:bg-sb-primary group-hover:text-white">
          <ArrowUpLeft className="h-4 w-4" />
        </span>
      </div>
    </div>
  </Link>
);
