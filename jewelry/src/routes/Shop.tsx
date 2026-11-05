import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, MATERIALS, COLLECTIONS, faCat, faMat, faColl } from "@/lib/products";
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

  const FilterGroup = ({ title, options, keyName, label }: { title: string; options: string[]; keyName: keyof ShopSearch; label: (v: string) => string }) => (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2 text-sm">
        {options.map((o) => (
          <li key={o}>
            <button
              onClick={() => toggle(keyName, o)}
              className={cn("transition hover:text-gold", search[keyName] === o ? "text-gold" : "text-muted-foreground")}
            >
              {label(o)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="pb-20">
      <PageHeader title="کالکشن" crumbs={["فروشگاه"]} />

      <div className="mx-auto mt-8 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <FilterGroup title="دسته" options={CATEGORIES} keyName="category" label={faCat} />
          <FilterGroup title="فلز" options={MATERIALS} keyName="material" label={faMat} />
          <FilterGroup title="کالکشن" options={COLLECTIONS} keyName="collection" label={faColl} />
          {activeCount > 0 && (
            <button onClick={clear} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">
              پاک کردن فیلترها ({activeCount})
            </button>
          )}
        </aside>

        {/* Grid */}
        <div>
          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} تکه</p>
          {filtered.length === 0 ? (
            <div className="card-lux flex flex-col items-center gap-3 p-12 text-center">
              <p className="font-serif text-2xl">هیچ تکه‌ای با این فیلترها مطابقت ندارد</p>
              <button onClick={clear} className="btn-ghost">پاک کردن فیلترها</button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/" className="btn-ghost">بازگشت به خانه</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
