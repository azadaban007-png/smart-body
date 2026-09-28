import { Link } from "react-router-dom";
import { ArrowUpLeft, MapPin, Sparkles, Star } from "lucide-react";
import { sportsLabel, toFa } from "@/lib/format";

export const RatingPill = ({ rating, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${className}`} data-testid="gym-rating">
    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    {toFa(rating)}
  </span>
);

// Presentational only: all content arrives via the `gym` prop (same shape as the WP `gym` CPT).
export const GymCard = ({ gym }) => (
  <Link
    to={`/gym/${gym.slug}`}
    data-testid={`gym-card-${gym.slug}`}
    className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sb-surface2 shadow-[var(--sb-card-shadow)] transition-transform duration-500 ease-out hover:-translate-y-1.5"
  >
    <img src={gym.image} alt={gym.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]" />
    <div className="absolute inset-0 bg-gradient-to-t from-sb-ink/95 via-sb-ink/30 to-sb-ink/5" />
    <div className="absolute inset-x-4 top-4 flex items-center justify-between">
      {gym.badge ? (
        <span className="sb-hero-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white" data-testid="gym-badge">
          <Sparkles className="h-3.5 w-3.5 text-sb-cyan" />
          {gym.badge}
        </span>
      ) : <span />}
      <RatingPill rating={gym.rating} className="sb-hero-glass text-white" />
    </div>
    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
      <h3 className="text-xl font-bold sm:text-[1.35rem]">{gym.name}</h3>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
        <MapPin className="h-4 w-4 shrink-0 text-sb-cyan" />
        <span className="truncate">{gym.city}، {gym.street}</span>
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
        <span className="truncate text-sm font-medium text-white/90">{sportsLabel(gym.sports)}</span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-[background-color,transform] duration-500 group-hover:-translate-x-1 group-hover:bg-sb-primary">
          <ArrowUpLeft className="h-4 w-4" />
        </span>
      </div>
    </div>
  </Link>
);
