import { Link, useLocation } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CONTACT, FOOTER } from "@/config/site";
import { handleSectionNav } from "@/lib/navigation";

const linkClass = "text-sm text-white/60 transition-colors duration-300 hover:text-white";

const FooterLink = ({ link, pathname }) => {
  const testId = `footer-link-${link.label.replace(/\s+/g, "-")}`;
  if (link.href) {
    return (
      <a href={link.href} className={linkClass} data-testid={testId} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.to} onClick={(e) => handleSectionNav(e, link.to, pathname)} className={linkClass} data-testid={testId}>
      {link.label}
    </Link>
  );
};

export const Footer = () => {
  const { pathname } = useLocation();
  return (
    <footer data-testid="site-footer" className="relative overflow-hidden border-t border-white/5 bg-sb-ink text-white">
      <div className="pointer-events-none absolute -top-40 left-10 h-80 w-80 rounded-full bg-sb-primary/20 blur-[120px]" />
      <div className="sb-container relative grid gap-12 py-16 md:py-20 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo light size={42} />
          <p className="mt-6 text-lg font-semibold leading-8 text-white/85">{FOOTER.tagline}</p>
          <div className="mt-8 flex items-center gap-3">
            <a href={`tel:${CONTACT.phone}`} aria-label="تماس تلفنی" data-testid="footer-phone" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-sb-cyan hover:text-sb-cyan"><Phone className="h-4 w-4" /></a>
            <a href={`mailto:${CONTACT.email}`} aria-label="ایمیل" data-testid="footer-email" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-sb-cyan hover:text-sb-cyan"><Mail className="h-4 w-4" /></a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="footer-instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-sb-cyan hover:text-sb-cyan"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 text-sm font-bold text-white">{col.title}</h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}><FooterLink link={link} pathname={pathname} /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="sb-container relative flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© ۱۴۰۵ بدن هوشمند. تمامی حقوق محفوظ است.</p>
        <p dir="ltr" className="tracking-[0.3em]">SMART BODY</p>
      </div>
    </footer>
  );
};
