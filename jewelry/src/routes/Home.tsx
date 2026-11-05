import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, COLLECTIONS } from "@/lib/products";

const HERO_IMG = "/hero-necklace.jpg";

const COLLECTION_IMAGES: Record<string, string> = {
  Bridal: "/bridal.jpg",
  Aurora: "/aurora-necklace.jpg",
  Heritage: "/ring.jpg",
  Celeste: "/hoops.jpg",
};

export function Home() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-16 h-[100svh] min-h-[560px] overflow-hidden md:-mt-20">
        <img src={HERO_IMG} alt="AURA fine jewellery" className="absolute inset-0 h-full w-full animate-slow-zoom object-cover" />
        <div className="absolute inset-0 bg-fade md:bg-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-end px-4 pb-20 text-center md:px-8">
          <span className="eyebrow animate-rise">Fine Jewellery · Est. 2026</span>
          <h1 className="animate-rise mt-4 font-serif text-5xl leading-tight md:text-7xl">
            Light, made <span className="text-gold-gradient">lasting</span>
          </h1>
          <p className="animate-rise mt-5 max-w-md text-sm text-muted-foreground md:text-base">
            Handcrafted pieces designed to be worn every day and treasured for generations.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className="btn-gold">Explore the collection <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/shop" search={{ collection: "Bridal" }} className="btn-ghost">The Bridal Edit</Link>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 text-center">
          <span className="eyebrow">Curated Edits</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Shop by Collection</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((c) => (
            <Link key={c} to="/shop" search={{ collection: c }} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <img src={COLLECTION_IMAGES[c]} alt={c} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                <h3 className="font-serif text-2xl">{c}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold opacity-0 transition group-hover:opacity-100">Discover <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow">Signature Pieces</span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">Featured This Season</h2>
          </div>
          <Link to="/shop" className="hidden text-sm uppercase tracking-widest text-muted-foreground hover:text-gold sm:inline-flex">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <img src="/campaign.jpg" alt="The AURA atelier" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Crafted by hand, made to endure</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Every AURA piece begins as a sketch and ends in the hands of a master goldsmith. We work
              in small batches, sourcing ethical stones and recycled metals, so each creation carries a
              story worth passing on.
            </p>
            <Link to="/journal" className="btn-ghost mt-8">Read the journal <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-center sm:grid-cols-3 md:px-8">
          {[
            ["Ethically Sourced", "Conflict-free stones and recycled metals, always."],
            ["Lifetime Guarantee", "Complimentary servicing and re-polishing for life."],
            ["Insured Delivery", "Complimentary insured shipping and gift wrapping."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-serif text-xl text-gold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
