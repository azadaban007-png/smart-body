import { ArrowUpLeft } from "lucide-react";
import { SERVICES } from "@/config/site";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { toFa } from "@/lib/format";

const ServiceCard = ({ service, index }) => (
  <article
    data-testid={`service-card-${service.id}`}
    className={`group relative isolate h-[400px] w-[80%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-sb-ink sm:w-[55%] lg:h-auto lg:w-auto ${service.layout}`}
  >
    <img src={service.image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sb-ink via-sb-ink/55 to-sb-ink/10" />
    <div className="flex h-full flex-col justify-between p-6 text-white sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white/60">{toFa(`0${index + 1}`)}</span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition-[background-color,transform,border-color] duration-500 group-hover:-translate-x-1 group-hover:border-sb-primary group-hover:bg-sb-primary">
          <ArrowUpLeft className="h-4 w-4" />
        </span>
      </div>
      <div className="transition-transform duration-500 group-hover:-translate-y-1">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {service.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium backdrop-blur">{t}</span>
          ))}
        </div>
        <h3 className="text-xl font-extrabold sm:text-2xl">{service.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-7 text-white/75">{service.description}</p>
      </div>
    </div>
  </article>
);

export const ServicesSection = () => (
  <section id="services" aria-labelledby="services-title" data-testid="services-section" className="scroll-mt-24 pb-24 md:pb-32">
    <Reveal className="sb-container mb-10">
      <SectionHeading id="services-title" eyebrow="فراتر از یک دایرکتوری" title="خدمات بدن هوشمند" subtitle="راهکارهایی برای ورزشکاران و کسب‌وکارهای ورزشی" />
    </Reveal>
    <Reveal>
      <div className="services-layout no-scrollbar pb-2" role="list" aria-label="خدمات بدن هوشمند">
        {SERVICES.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </Reveal>
  </section>
);
