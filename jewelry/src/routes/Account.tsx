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
        <PageHeader title="My Account" crumbs={["Account"]} />
        <p className="mt-10 font-serif text-2xl">You are not signed in</p>
        <Link to="/signin" className="btn-gold mt-6">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title="My Account" crumbs={["Account"]} />
      <div className="mx-auto mt-8 max-w-5xl px-4 md:px-8">
        <div className="card-lux flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="eyebrow">Member</p>
            <h2 className="mt-1 font-serif text-2xl">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="btn-ghost"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="card-lux p-6">
            <div className="flex items-center gap-3"><Package className="h-5 w-5 text-gold" /><h3 className="font-serif text-xl">Orders</h3></div>
            <p className="mt-3 text-sm text-muted-foreground">You have no recent orders yet. Your jewellery journey begins here.</p>
            <Link to="/shop" className="btn-ghost mt-4">Start shopping</Link>
          </div>
          <div className="card-lux p-6">
            <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-gold" /><h3 className="font-serif text-xl">Wishlist</h3></div>
            <p className="mt-3 text-sm text-muted-foreground">{wishlist.length} saved {wishlist.length === 1 ? "piece" : "pieces"}.</p>
            <Link to="/wishlist" className="btn-ghost mt-4">View wishlist</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
