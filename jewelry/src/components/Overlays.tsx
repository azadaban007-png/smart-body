import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, faCat, faColl, getProduct, PRODUCTS, searchProducts } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function QtyStepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button className="grid h-8 w-8 place-items-center hover:text-gold" onClick={() => onChange(value - 1)} aria-label="کاهش تعداد"><Minus className="h-3 w-3" /></button>
      <span className="w-6 text-center text-sm" aria-live="polite">{value}</span>
      <button className="grid h-8 w-8 place-items-center hover:text-gold disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="افزایش تعداد"><Plus className="h-3 w-3" /></button>
    </div>
  );
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal } = useStore();
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md">
        <div className="border-b border-border p-6"><SheetTitle className="font-serif text-2xl font-normal">سبد شما</SheetTitle></div>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-gold" />
            <p className="font-serif text-2xl">سبد شما خالی است</p>
            <p className="text-sm text-muted-foreground">تکه‌هایی که شایسته نگهداری هستند را کشف کنید.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-gold mt-2">کاوش کالکشن</Link>
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
                      <div className="flex justify-between gap-2"><span className="truncate font-serif text-lg">{p.name}</span><button onClick={() => removeFromCart(l.key)} aria-label={`حذف ${p.name}`} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button></div>
                      {l.variant && <span className="text-xs text-muted-foreground">{l.variant}</span>}
                      <div className="mt-auto flex items-center justify-between"><QtyStepper value={l.qty} max={p.stock} onChange={(n) => updateQty(l.key, n)} /><span className="text-gold">{formatPrice(p.price * l.qty)}</span></div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-4 border-t border-border p-6">
              <div className="flex justify-between"><span className="text-muted-foreground">جمع کل</span><span className="font-serif text-xl">{formatPrice(subtotal)}</span></div>
              <p className="text-xs text-muted-foreground">ارسال بیمه‌شده رایگان و بسته‌بندی هدیه.</p>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-gold w-full">تسویه حساب</Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-ghost w-full">مشاهده سبد</Link>
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
    <div className="animate-in fade-in fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="جستجو">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-20">
        <div className="flex justify-end"><button onClick={close} aria-label="بستن جستجو" className="grid h-10 w-10 place-items-center rounded-full hover:text-gold"><X /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); close(); navigate({ to: "/search", search: { q } }); }} className="mt-6 flex items-center gap-4 border-b border-border pb-4">
          <Search className="h-6 w-6 text-gold" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی انگشتر، الماس، کالکشن‌ها…" aria-label="جستجوی محصولات" className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-muted-foreground md:text-4xl" />
        </form>
        {!q && (
          <div className="mt-8"><p className="eyebrow mb-4">محبوب</p><div className="flex flex-wrap gap-2">{[["الماس","Diamond"],["انگشتر","Rings"],["طلا","Gold"],["عروس","Bridal"],["گردنبند","Necklaces"]].map(([t,tag]) => <button key={tag} onClick={() => setQ(t)} className="btn-ghost !px-4 !py-2">{t}</button>)}</div></div>
        )}
        {q && results.length === 0 && <p className="mt-10 text-center text-muted-foreground">هیچ تکه‌ای با «{q}» مطابقت ندارد. «انگشتر» یا «طلا» را امتحان کنید.</p>}
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
              <span className="eyebrow">{faColl(p.collection)} · {faCat(p.category)}</span>
              <DialogTitle className="font-serif text-3xl font-normal">{p.name}</DialogTitle>
              <p className="text-xl text-gold">{formatPrice(p.price)}</p>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <div className="flex flex-wrap gap-2">{p.metals.map((m) => <button key={m} onClick={() => setMetal(m)} aria-pressed={metal === m} className={cn("rounded-full border px-3 py-1 text-xs", metal === m ? "border-gold text-gold" : "border-border")}>{m}</button>)}</div>
              <div className="mt-auto flex gap-2">
                <button className="btn-gold flex-1" disabled={p.stock === 0} onClick={() => { addToCart(p.id, 1, metal); setQuickView(null); setCartOpenViaStore(); }}>افزودن به سبد</button>
                <button className="btn-ghost" onClick={() => toggleWishlist(p.id)} aria-label="علاقه‌مندی"><Heart className={cn("h-4 w-4", inWishlist(p.id) && "fill-gold text-gold")} /></button>
              </div>
              <Link to="/product/$id" params={{ id: p.id }} onClick={() => setQuickView(null)} className="text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">مشاهده جزئیات کامل</Link>
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
