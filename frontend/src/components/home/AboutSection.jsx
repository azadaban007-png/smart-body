import { ABOUT } from "@/config/site";
import { Reveal } from "@/components/common/Reveal";
import { toFa } from "@/lib/format";

export const AboutSection = () => (
  <section id="about" aria-labelledby="about-title" data-testid="about-section" className="scroll-mt-24 border-y border-sb-border bg-sb-surface py-20 md:py-28">
    <div className="sb-container grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <Reveal>
        <p className="sb-eyebrow mb-4">{ABOUT.eyebrow}</p>
        <h2 id="about-title" className="text-3xl font-extrabold leading-[1.45] text-sb-text sm:text-4xl lg:text-[2.6rem]">{ABOUT.title}</h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-sb-muted md:text-lg">{ABOUT.description}</p>
      </Reveal>
      <ol className="flex flex-col">
        {ABOUT.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <li className="group flex gap-6 border-b border-sb-border py-7 first:pt-0 last:border-0" data-testid={`about-step-${i + 1}`}>
              <span className="text-4xl font-black text-sb-primary/25 transition-colors duration-500 group-hover:text-sb-primary">{toFa(`0${i + 1}`)}</span>
              <div>
                <h3 className="text-lg font-bold text-sb-text sm:text-xl">{step.title}</h3>
                <p className="mt-2 leading-7 text-sb-muted">{step.text}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);
