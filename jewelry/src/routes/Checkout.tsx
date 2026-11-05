import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Checkout() {
  const { cart, subtotal, user, setUser } = useStore();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    address: "",
    city: "",
    zip: "",
    country: "",
    card: "",
  });

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <PageHeader title="تسویه حساب" crumbs={["تسویه حساب"]} />
        <p className="mt-10 font-serif text-2xl">سبد شما خالی است</p>
        <Link to="/shop" className="btn-gold mt-6">کاوش کالکشن</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-soft text-gold"><Check className="h-8 w-8" /></div>
        <h1 className="mt-6 font-serif text-4xl">متشکریم، {form.name || "دوست"}.</h1>
        <p className="mt-3 text-sm text-muted-foreground">سفارش شما ثبت شد. تأییدی به {form.email || "صندوق ورودی شما"} ارسال می‌شود.</p>
        <Link to="/shop" className="btn-gold mt-8">ادامه خرید</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email) setUser({ name: form.name || "Guest", email: form.email });
    useStore.setState({ cart: [], cartCount: 0, subtotal: 0 });
    setDone(true);
    navigate({ to: "/checkout" });
  };

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="pb-20">
      <PageHeader title="تسویه حساب" crumbs={["تسویه حساب"]} />
      <form onSubmit={submit} className="mx-auto mt-8 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 font-serif text-2xl">تماس</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">نام</span><input className="field" required value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">ایمیل</span><input type="email" className="field" required value={form.email} onChange={(e) => set("email", e.target.value)} /></label>
            </div>
          </section>
          <section>
            <h2 className="mb-4 font-serif text-2xl">ارسال</h2>
            <div className="grid gap-4">
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">آدرس</span><input className="field" required value={form.address} onChange={(e) => set("address", e.target.value)} /></label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">شهر</span><input className="field" required value={form.city} onChange={(e) => set("city", e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">کد پستی</span><input className="field" required value={form.zip} onChange={(e) => set("zip", e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">کشور</span><input className="field" required value={form.country} onChange={(e) => set("country", e.target.value)} /></label>
              </div>
            </div>
          </section>
          <section>
            <h2 className="mb-4 font-serif text-2xl">پرداخت</h2>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">شماره کارت</span><input className="field" required placeholder="4242 4242 4242 4242" value={form.card} onChange={(e) => set("card", e.target.value)} /></label>
            <p className="mt-2 text-xs text-muted-foreground">تسویه حساب نمایشی — هیچ پرداخت واقعی انجام نمی‌شود.</p>
          </section>
        </div>

        <aside className="card-lux h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl">سفارش شما</h2>
          <ul className="space-y-3">
            {cart.map((l) => {
              const p = getProduct(l.id)!;
              return (
                <li key={l.key} className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="h-14 w-12 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base">{p.name}</p>
                    <p className="text-xs text-muted-foreground">تعداد {l.qty}{l.variant ? ` · ${l.variant}` : ""}</p>
                  </div>
                  <span className="text-sm text-gold">{formatPrice(p.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between border-t border-border pt-4 font-serif text-xl"><span>مجموع</span><span className="text-gold">{formatPrice(subtotal)}</span></div>
          <button type="submit" className="btn-gold w-full">ثبت سفارش</button>
        </aside>
      </form>
    </div>
  );
}
