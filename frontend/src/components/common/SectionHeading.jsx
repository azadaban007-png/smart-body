export const SectionHeading = ({ eyebrow, title, subtitle, id, className = "" }) => (
  <div className={className}>
    {eyebrow && <p className="sb-eyebrow mb-3">{eyebrow}</p>}
    <h2 id={id} className="text-3xl font-extrabold leading-tight text-sb-text sm:text-4xl lg:text-[2.75rem]">
      {title}
    </h2>
    {subtitle && <p className="mt-3 text-base text-sb-muted md:text-lg">{subtitle}</p>}
  </div>
);
