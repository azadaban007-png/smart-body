import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const cols = [
  { title: "Shop", links: [["Rings", { category: "Rings" }], ["Earrings", { category: "Earrings" }], ["Bracelets", { category: "Bracelets" }], ["Necklaces", { category: "Necklaces" }]] },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-4xl tracking-[0.35em] text-gold-gradient">AURA</p>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Fine jewellery crafted by hand, designed to be worn for a lifetime and passed on for generations.</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="Social media" className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-gold hover:text-gold"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}><p className="eyebrow mb-4">{c.title}</p><ul className="space-y-2 text-sm text-muted-foreground">{c.links.map(([l, s]) => <li key={l}><Link to="/shop" search={s} className="hover:text-foreground">{l}</Link></li>)}</ul></div>
        ))}
        <div><p className="eyebrow mb-4">About</p><ul className="space-y-2 text-sm text-muted-foreground"><li><Link to="/journal" className="hover:text-foreground">Journal</Link></li><li><a href="/#story" className="hover:text-foreground">Our Story</a></li><li><a href="#" className="hover:text-foreground">Ateliers</a></li></ul></div>
        <div><p className="eyebrow mb-4">Customer Care</p><ul className="space-y-2 text-sm text-muted-foreground"><li><Link to="/account" className="hover:text-foreground">My Account</Link></li><li><Link to="/cart" className="hover:text-foreground">Shopping Bag</Link></li><li><a href="#" className="hover:text-foreground">Shipping & Returns</a></li><li><a href="#" className="hover:text-foreground">Size Guide</a></li></ul></div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row md:px-8">
          <p>© 2026 AURA Fine Jewellery. All rights reserved.</p>
          <ul className="flex gap-2" aria-label="Payment methods">{["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((m) => <li key={m} className="rounded border border-border px-2 py-1 tracking-wider">{m}</li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
