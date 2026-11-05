import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const NAV = [
  { label: "کالکشن‌ها", search: {} },
  { label: "الماس", search: { material: "Diamond" } },
  { label: "طلا", search: { material: "Gold" } },
  { label: "نقره", search: { material: "Silver" } },
  { label: "عروس", search: { collection: "Bridal" } },
] as const;

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="absolute -left-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-foreground">{n}</span>;
}

export function Header() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen, user } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const icon = "relative grid h-9 w-9 place-items-center rounded-full transition hover:text-gold";
  return (
    <header className={cn("sticky top-0 z-40 transition-colors duration-500", scrolled ? "border-b border-border bg-background/85 backdrop-blur-lg" : "bg-transparent")}>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        <div className="flex items-center gap-1">
          <button className={cn(icon, "lg:hidden")} onClick={() => setOpen(true)} aria-label="باز کردن منو"><Menu className="h-5 w-5" /></button>
          <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground lg:flex" aria-label="ناوبری اصلی">
            {NAV.map((n) => <Link key={n.label} to="/shop" search={n.search} className="transition hover:text-foreground">{n.label}</Link>)}
            <Link to="/journal" className="transition hover:text-foreground">ژورنال</Link>
          </nav>
        </div>
        <Link to="/" className="font-serif text-3xl tracking-[0.35em] text-gold-gradient md:text-4xl" aria-label="صفحه اصلی AURA">AURA</Link>
        <div className="flex items-center justify-end gap-1">
          <button className={icon} onClick={() => setSearchOpen(true)} aria-label="جستجو"><Search className="h-5 w-5" /></button>
          <Link to={user ? "/account" : "/signin"} className={cn(icon, "hidden sm:grid")} aria-label="حساب کاربری"><User className="h-5 w-5" /></Link>
          <Link to="/wishlist" className={icon} aria-label={`لیست علاقه‌مندی‌ها، ${wishlist.length} مورد`}><Heart className="h-5 w-5" /><Badge n={wishlist.length} /></Link>
          <button className={icon} onClick={() => setCartOpen(true)} aria-label={`سبد خرید، ${cartCount} مورد`}><ShoppingBag className="h-5 w-5" /><Badge n={cartCount} /></button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="منو">
          <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setOpen(false)} />
          <div className="animate-in slide-in-from-right absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col gap-8 border-l border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.35em] text-gold">AURA</span>
              <button className={icon} onClick={() => setOpen(false)} aria-label="بستن منو"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex flex-col gap-5 font-serif text-2xl" onClick={() => setOpen(false)}>
              {NAV.map((n) => <Link key={n.label} to="/shop" search={n.search} className="hover:text-gold">{n.label}</Link>)}
              <Link to="/journal" className="hover:text-gold">ژورنال</Link>
              <Link to={user ? "/account" : "/signin"} className="hover:text-gold">حساب کاربری</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
