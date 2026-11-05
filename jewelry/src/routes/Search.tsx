import { Link, useSearch } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/products";

export function Search() {
  const { q } = useSearch({ from: "/search" });
  const results = searchProducts(q);

  return (
    <div className="pb-20">
      <PageHeader title="Search" crumbs={["Search"]} />
      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <SearchIcon className="h-5 w-5 text-gold" />
          <span className="font-serif text-2xl">{q ? `“${q}”` : "Search AURA"}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"}</p>

        {results.length === 0 ? (
          <div className="card-lux mt-6 flex flex-col items-center gap-3 p-16 text-center">
            <p className="font-serif text-2xl">No pieces found</p>
            <p className="text-sm text-muted-foreground">Try “ring”, “gold”, or “bridal”.</p>
            <Link to="/shop" className="btn-gold mt-2">Browse the collection</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
