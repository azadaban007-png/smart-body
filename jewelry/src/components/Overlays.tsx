import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, getProduct, PRODUCTS, searchProducts } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function QtyStepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button className="grid h-8 w-8 place-items-center hover:text-gold" onClick={() => onChange(value - 1)} aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
      <span className="w-6 text-center text-sm" aria-live="polite">{value}</span>
      <button className="grid h-8 w-8 place-items-center hover:text-gold disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
    </div>
  );
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal } = useStore();
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md">
        <div className="border-b border-border p-6"><SheetTitle className="font-serif text-2xl font-normal">Your Bag</SheetTitle></div>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-gold" />
            <p className="font-serif text-2xl">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Discover pieces made to be treasured.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-gold mt-2">Explore the collection</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto p-6">
              {cart.map((l) => {
                const p = getProduct(l.id)!;
                return (
                  <li key={l.key} className="flex gap-4">
                    <img src={p.images[0]} alt="" className="h-24 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2"><span className="truncate font-serif text-lg">{p.name}</span><button onClick={() => removeFromCart(l.key)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button></div>
                      {l.variant && <span className="text-xs text-muted-foreground">{l.variant}</span>}
                      <div className="mt-auto flex items-center justify-between"><QtyStepper value={l.qty} max={p.stock} onChange={(n) => updateQty(l.key, n)} /><span className="text-gold">{formatPrice(p.price * l.qty)}</span></div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-4 border-t border-border p-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-serif text-xl">{formatPrice(subtotal)}</span></div>
              <p className="text-xs text-muted-foreground">Complimentary insured shipping & gift wrapping.</p>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-gold w-full">Checkout</Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-ghost w-full">View bag</Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => { if (searchOpen) setTimeout(() => ref.current?.focus(), 50); else setQ(""); }, [searchOpen]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [setSearchOpen]);
  if (!searchOpen) return null;
  const results = searchProducts(q);
  const close = () => setSearchOpen(false);
  return (
    <div className="animate-in fade-in fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-20">
        <div className="flex justify-end"><button onClick={close} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full hover:text-gold"><X /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); close(); navigate({ to: "/search", search: { q } }); }} className="mt-6 flex items-center gap-4 border-b border-border pb-4">
          <Search className="h-6 w-6 text-gold" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rings, diamonds, collections…" aria-label="Search products" className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-muted-foreground md:text-4xl" />
        </form>
        {!q && (
          <div className="mt-8"><p className="eyebrow mb-4">Popular</p><div className="flex flex-wrap gap-2">{["Diamond", "Rings", "Gold", "Bridal", "Necklaces"].map((t) => <button key={t} onClick={() => setQ(t)} className="btn-ghost !px-4 !py-2">{t}</button>)}</div></div>
        )}
        {q && results.length === 0 && <p className="mt-10 text-center text-muted-foreground">No pieces match “{q}”. Try “ring” or “gold”.</p>}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {results.map((p) => (
            <li key={p.id}><Link to="/product/$id" params={{ id: p.id }} onClick={close} className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-muted">
              <img src={p.images[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
              <div><p className="font-serif text-lg">{p.name}</p><p className="text-sm text-gold">{formatPrice(p.price)}</p></div>
            </Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function QuickViewModal() {
  const { quickView: p, setQuickView, addToCart, toggleWishlist, inWishlist } = useStore();
  const [metal, setMetal] = useState("");
  useEffect(() => { if (p) setMetal(p.metals[0]); }, [p]);
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && setQuickView(null)}>
      <DialogContent className="max-w-3xl overflow-hidden border-border bg-card p-0">
        {p && (
          <div className="grid md:grid-cols-2">
            <img src={p.images[0]} alt={p.name} className="aspect-square h-full w-full object-cover" />
            <div className="flex flex-col gap-4 p-6">
              <span className="eyebrow">{p.collection} · {p.category}</span>
              <DialogTitle className="font-serif text-3xl font-normal">{p.name}</DialogTitle>
              <p className="text-xl text-gold">{formatPrice(p.price)}</p>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <div className="flex flex-wrap gap-2">{p.metals.map((m) => <button key={m} onClick={() => setMetal(m)} aria-pressed={metal === m} className={cn("rounded-full border px-3 py-1 text-xs", metal === m ? "border-gold text-gold" : "border-border")}>{m}</button>)}</div>
              <div className="mt-auto flex gap-2">
                <button className="btn-gold flex-1" disabled={p.stock === 0} onClick={() => { addToCart(p.id, 1, metal); setQuickView(null); setCartOpenViaStore(); }}>Add to bag</button>
                <button className="btn-ghost" onClick={() => toggleWishlist(p.id)} aria-label="Toggle wishlist"><Heart className={cn("h-4 w-4", inWishlist(p.id) && "fill-gold text-gold")} /></button>
              </div>
              <Link to="/product/$id" params={{ id: p.id }} onClick={() => setQuickView(null)} className="text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">View full details</Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper to open the cart drawer after adding from quick view, without importing the store twice.
function setCartOpenViaStore() {
  useStore.getState().setCartOpen(true);
}

export const _all = PRODUCTS;
