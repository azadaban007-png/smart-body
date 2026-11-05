import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist, setQuickView } = useStore();
  const saved = inWishlist(product.id);
  return (
    <article className="card-lux group relative flex flex-col overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
          <img src={product.images[0]} alt={product.name} loading="lazy" width={800} height={1000}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        {product.isNew && <span className="eyebrow absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 backdrop-blur">New</span>}
        {product.stock === 0 && <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">Sold out</span>}
        <button onClick={() => toggleWishlist(product.id)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/60 backdrop-blur transition hover:bg-background">
          <Heart className={cn("h-4 w-4", saved && "fill-gold text-gold")} />
        </button>
        <button onClick={() => setQuickView(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-background/80 py-2 text-xs uppercase tracking-widest opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100">
          <Eye className="h-4 w-4" /> Quick view
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</span>
        <Link to="/product/$id" params={{ id: product.id }} className="font-serif text-xl hover:text-gold">{product.name}</Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-gold">{formatPrice(product.price)}</span>
          <button onClick={() => addToCart(product.id)} disabled={product.stock === 0} aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition hover:border-gold hover:text-gold disabled:opacity-40">
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-lux overflow-hidden">
      <div className="aspect-[4/5] animate-pulse bg-muted" />
      <div className="space-y-2 p-4"><div className="h-3 w-1/3 animate-pulse rounded bg-muted" /><div className="h-5 w-2/3 animate-pulse rounded bg-muted" /><div className="h-4 w-1/4 animate-pulse rounded bg-muted" /></div>
    </div>
  );
}
