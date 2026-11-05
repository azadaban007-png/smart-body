import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, Package } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";

export function Account() {
  const { user, signOut, wishlist } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <PageHeader title="حساب من" crumbs={["حساب"]} />
        <p className="mt-10 font-serif text-2xl">شما وارد نشده‌اید</p>
        <Link to="/signin" className="btn-gold mt-6">ورود</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title="حساب من" crumbs={["حساب"]} />
      <div className="mx-auto mt-8 max-w-5xl px-4 md:px-8">
        <div className="card-lux flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="eyebrow">عضو</p>
            <h2 className="mt-1 font-serif text-2xl">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="btn-ghost"><LogOut className="h-4 w-4" /> خروج</button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="card-lux p-6">
            <div className="flex items-center gap-3"><Package className="h-5 w-5 text-gold" /><h3 className="font-serif text-xl">سفارش‌ها</h3></div>
            <p className="mt-3 text-sm text-muted-foreground">شما سفارش اخیری ندارید. سفر جواهری شما از اینجا آغاز می‌شود.</p>
            <Link to="/shop" className="btn-ghost mt-4">شروع خرید</Link>
          </div>
          <div className="card-lux p-6">
            <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-gold" /><h3 className="font-serif text-xl">علاقه‌مندی‌ها</h3></div>
            <p className="mt-3 text-sm text-muted-foreground">{wishlist.length} تکه ذخیره‌شده.</p>
            <Link to="/wishlist" className="btn-ghost mt-4">مشاهده علاقه‌مندی‌ها</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
