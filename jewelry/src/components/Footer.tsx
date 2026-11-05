import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const cols = [
  { title: "فروشگاه", links: [["انگشتر", { category: "Rings" }], ["گوشواره", { category: "Earrings" }], ["دستبند", { category: "Bracelets" }], ["گردنبند", { category: "Necklaces" }]] },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-4xl tracking-[0.35em] text-gold-gradient">AURA</p>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">جواهرات فاخر دست‌ساز، برای پوشیدن یک عمر و پاسداشت در نسل‌های آینده.</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="شبکه اجتماعی" className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-gold hover:text-gold"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}><p className="eyebrow mb-4">{c.title}</p><ul className="space-y-2 text-sm text-muted-foreground">{c.links.map(([l, s]) => <li key={l}><Link to="/shop" search={s} className="hover:text-foreground">{l}</Link></li>)}</ul></div>
        ))}
        <div><p className="eyebrow mb-4">درباره ما</p><ul className="space-y-2 text-sm text-muted-foreground"><li><Link to="/journal" className="hover:text-foreground">ژورنال</Link></li><li><a href="/#story" className="hover:text-foreground">داستان ما</a></li><li><a href="#" className="hover:text-foreground">کارگاه‌ها</a></li></ul></div>
        <div><p className="eyebrow mb-4">پشتیبانی</p><ul className="space-y-2 text-sm text-muted-foreground"><li><Link to="/account" className="hover:text-foreground">حساب من</Link></li><li><Link to="/cart" className="hover:text-foreground">سبد خرید</Link></li><li><a href="#" className="hover:text-foreground">ارسال و بازگشت</a></li><li><a href="#" className="hover:text-foreground">راهنمای سایز</a></li></ul></div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row md:px-8">
          <p>© ۲۰۲۶ جواهرات فاخر AURA. تمام حقوق محفوظ است.</p>
          <ul className="flex gap-2" aria-label="روش‌های پرداخت">{["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((m) => <li key={m} className="rounded border border-border px-2 py-1 tracking-wider">{m}</li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
