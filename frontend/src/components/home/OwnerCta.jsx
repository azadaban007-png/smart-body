import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { OWNER_CTA } from "@/config/site";
import { Reveal } from "@/components/common/Reveal";

export const OwnerCta = () => (
  <section aria-labelledby="owner-cta-title" data-testid="owner-cta-section" className="py-20 md:py-28">
    <div className="sb-container">
      <Reveal className="group relative isolate overflow-hidden rounded-[2rem] bg-sb-ink sm:rounded-[2.5rem]">
        <img src={OWNER_CTA.image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-sb-ink via-sb-ink/80 to-sb-ink/20" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-72 w-72 rounded-full bg-sb-cyan/25 blur-[110px]" />
        <div className="flex min-h-[520px] max-w-2xl flex-col justify-center px-6 py-14 text-white sm:px-12 lg:px-16">
          <p className="inline-flex items-center gap-2.5 text-sm font-bold text-sb-cyan">
            <span className="h-0.5 w-6 rounded bg-sb-cyan" />
            {OWNER_CTA.eyebrow}
          </p>
          <h2 id="owner-cta-title" className="mt-5 text-3xl font-black leading-[1.4] sm:text-4xl lg:text-5xl lg:leading-[1.35]">{OWNER_CTA.title}</h2>
          <p className="mt-5 text-base leading-8 text-white/75 md:text-lg">{OWNER_CTA.description}</p>
          <ul className="mt-8 space-y-3">
            {OWNER_CTA.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/85 sm:text-base">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sb-cyan/20 text-sb-cyan"><Check className="h-3.5 w-3.5" /></span>
                {p}
              </li>
            ))}
          </ul>
          <Link to="/register" data-testid="owner-cta-button" className="sb-btn-primary group/btn mt-10 h-14 w-full px-8 text-base sm:w-fit">
            {OWNER_CTA.button}
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover/btn:-translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
