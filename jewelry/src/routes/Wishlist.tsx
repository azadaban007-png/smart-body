import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Wishlist() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="pb-20">
      <PageHeader title="علاقه‌مندی‌ها" crumbs={["علاقه‌مندی‌ها"]} />
      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
        {items.length === 0 ? (
          <div className="card-lux flex flex-col items-center gap-3 p-16 text-center">
            <Heart className="h-10 w-10 text-gold" />
            <p className="font-serif text-2xl">لیست علاقه‌مندی‌های شما خالی است</p>
            <p className="text-sm text-muted-foreground">روی قلب هر تکه بزنید تا اینجا ذخیره شود.</p>
            <Link to="/shop" className="btn-gold mt-2">کاوش کالکشن</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
