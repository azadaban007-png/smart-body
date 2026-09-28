import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NAV_ITEMS } from "@/config/site";
import { handleSectionNav } from "@/lib/navigation";

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
};

export const Header = () => {
  const { pathname, hash } = useLocation();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname, hash]);

  const onHero = pathname === "/" && !scrolled && !open;
  const activeId = pathname === "/" ? hash.slice(1) || "home" : null;

  return (
    <header data-testid="site-header" className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ${scrolled ? "pt-2" : "pt-4"}`}>
      <div className="sb-container">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl px-3 sm:px-5 transition-[height,background-color,border-color,box-shadow] duration-500 ${
            scrolled ? "h-16" : "h-[72px]"
          } ${onHero ? "sb-hero-glass" : "sb-glass shadow-[0_12px_32px_-20px_rgba(16,36,58,0.35)]"}`}
        >
          <Link to="/" onClick={(e) => handleSectionNav(e, "/", pathname)} data-testid="header-logo-link" aria-label="بدن هوشمند - صفحه اصلی">
            <Logo light={onHero} size={scrolled ? 34 : 38} />
          </Link>

          <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={(e) => handleSectionNav(e, item.to, pathname)}
                data-testid={`nav-link-${item.id}`}
                className={`relative rounded-full px-4 py-2 text-[0.94rem] font-medium transition-colors duration-300 ${
                  onHero ? "text-white/80 hover:text-white" : "text-sb-muted hover:text-sb-text"
                } ${activeId === item.id ? (onHero ? "!text-white" : "!text-sb-text") : ""}`}
              >
                {item.label}
                {activeId === item.id && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sb-cyan" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle onHero={onHero} />
            <Link to="/register" data-testid="header-register-cta" className="sb-btn-primary hidden h-11 px-5 text-sm sm:inline-flex">
              ثبت باشگاه
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              data-testid="mobile-menu-toggle"
              className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${onHero ? "border-white/20 text-white" : "border-sb-border text-sb-text"}`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <MobileMenu open={open} pathname={pathname} onNavigate={() => setOpen(false)} />
      </div>
    </header>
  );
};
