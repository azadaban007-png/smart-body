import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, PRODUCTS, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Product() {
  const { id } = useParams({ from: "/product/$id" });
  const product = getProduct(id);
  const { addToCart, toggleWishlist, inWishlist, setCartOpen } = useStore();
  const [metal, setMetal] = useState(product?.metals[0] ?? "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <h1 className="font-serif text-4xl">Piece not found</h1>
        <Link to="/shop" className="btn-gold mt-6">Back to collection</Link>
      </div>
    );
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const saved = inWishlist(product.id);

  return (
    <div className="pb-20">
      <PageHeader title={product.name} crumbs={[product.category, product.name]} />

      <div className="mx-auto mt-8 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-2">
        {/* Image */}
        <div className="card-lux overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <span className="eyebrow">{product.collection} · {product.category}</span>
          <p className="text-3xl text-gold">{formatPrice(product.price)}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Metal</p>
            <div className="flex flex-wrap gap-2">
              {product.metals.map((m) => (
                <button key={m} onClick={() => setMetal(m)} aria-pressed={metal === m}
                  className={cn("rounded-full border px-4 py-2 text-sm transition", metal === m ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-gold")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</p>
            <div className="inline-flex items-center rounded-full border border-border">
              <button className="grid h-9 w-9 place-items-center hover:text-gold" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button className="grid h-9 w-9 place-items-center hover:text-gold disabled:opacity-30" disabled={qty >= product.stock} onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              className="btn-gold flex-1"
              disabled={product.stock === 0}
              onClick={() => { addToCart(product.id, qty, metal); setCartOpen(true); }}
            >
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </button>
            <button className="btn-ghost" onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">
              <Heart className={cn("h-4 w-4", saved && "fill-gold text-gold")} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-gold" /> Complimentary insured shipping & 30-day returns
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronRight className="h-4 w-4" /> You may also like
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
