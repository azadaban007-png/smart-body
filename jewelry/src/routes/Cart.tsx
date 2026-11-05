import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Cart() {
  const { cart, updateQty, removeFromCart, subtotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <PageHeader title="Shopping Bag" crumbs={["Bag"]} />
        <p className="mt-10 font-serif text-2xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Discover pieces made to be treasured.</p>
        <Link to="/shop" className="btn-gold mt-6">Explore the collection</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title="Shopping Bag" crumbs={["Bag"]} />
      <div className="mx-auto mt-8 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border">
          {cart.map((l) => {
            const p = getProduct(l.id)!;
            return (
              <li key={l.key} className="flex gap-5 py-6">
                <img src={p.images[0]} alt="" className="h-32 w-24 shrink-0 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link to="/product/$id" params={{ id: p.id }} className="font-serif text-xl hover:text-gold">{p.name}</Link>
                      {l.variant && <p className="text-xs text-muted-foreground">{l.variant}</p>}
                    </div>
                    <button onClick={() => removeFromCart(l.key)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button className="grid h-8 w-8 place-items-center hover:text-gold" onClick={() => updateQty(l.key, l.qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button className="grid h-8 w-8 place-items-center hover:text-gold disabled:opacity-30" disabled={l.qty >= p.stock} onClick={() => updateQty(l.key, l.qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-gold">{formatPrice(p.price * l.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card-lux h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl">Order Summary</h2>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span className="text-gold">Complimentary</span></div>
          <div className="flex justify-between border-t border-border pt-4 font-serif text-xl"><span>Total</span><span className="text-gold">{formatPrice(subtotal)}</span></div>
          <Link to="/checkout" className="btn-gold w-full">Proceed to checkout</Link>
          <Link to="/shop" className="btn-ghost w-full">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
