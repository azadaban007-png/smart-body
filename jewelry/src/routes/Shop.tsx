import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, MATERIALS, COLLECTIONS } from "@/lib/products";
import { cn } from "@/lib/utils";

type ShopSearch = { material?: string; collection?: string; category?: string };

export function Shop() {
  const search = useSearch({ from: "/shop" }) as ShopSearch;
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        (!search.material || p.material === search.material) &&
        (!search.collection || p.collection === search.collection) &&
        (!search.category || p.category === search.category),
    );
  }, [search.material, search.collection, search.category]);

  const activeCount = [search.material, search.collection, search.category].filter(Boolean).length;

  const toggle = (key: keyof ShopSearch, value: string) => {
    const next = { ...search };
    if (next[key] === value) delete next[key];
    else next[key] = value;
    navigate({ to: "/shop", search: next });
  };

  const clear = () => navigate({ to: "/shop", search: {} });

  const FilterGroup = ({ title, options, keyName }: { title: string; options: string[]; keyName: keyof ShopSearch }) => (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2 text-sm">
        {options.map((o) => (
          <li key={o}>
            <button
              onClick={() => toggle(keyName, o)}
              className={cn("transition hover:text-gold", search[keyName] === o ? "text-gold" : "text-muted-foreground")}
            >
              {o}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="pb-20">
      <PageHeader title="The Collection" crumbs={["Shop"]} />

      <div className="mx-auto mt-8 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <FilterGroup title="Category" options={CATEGORIES} keyName="category" />
          <FilterGroup title="Material" options={MATERIALS} keyName="material" />
          <FilterGroup title="Collection" options={COLLECTIONS} keyName="collection" />
          {activeCount > 0 && (
            <button onClick={clear} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">
              Clear filters ({activeCount})
            </button>
          )}
        </aside>

        {/* Grid */}
        <div>
          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} pieces</p>
          {filtered.length === 0 ? (
            <div className="card-lux flex flex-col items-center gap-3 p-12 text-center">
              <p className="font-serif text-2xl">No pieces match those filters</p>
              <button onClick={clear} className="btn-ghost">Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/" className="btn-ghost">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
