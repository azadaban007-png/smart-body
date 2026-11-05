import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/lib/products";

export type CartLine = { key: string; id: string; qty: number; variant?: string };
export type User = { name: string; email: string };

type State = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  quickView: Product | null;
  user: User | null;
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number, variant?: string) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (p: Product | null) => void;
  setUser: (u: User | null) => void;
  signOut: () => void;
};

const lineKey = (id: string, variant?: string) => `${id}__${variant ?? ""}`;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      searchOpen: false,
      quickView: null as Product | null,
      user: null,
      cartCount: 0,
      subtotal: 0,
      addToCart: (id, qty = 1, variant) =>
        set((s) => {
          const key = lineKey(id, variant);
          const existing = s.cart.find((l) => l.key === key);
          const cart = existing
            ? s.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...s.cart, { key, id, qty, variant }];
          return { ...recompute(cart), cart };
        }),
      updateQty: (key, qty) =>
        set((s) => {
          const cart =
            qty <= 0
              ? s.cart.filter((l) => l.key !== key)
              : s.cart.map((l) => (l.key === key ? { ...l, qty } : l));
          return { ...recompute(cart), cart };
        }),
      removeFromCart: (key) =>
        set((s) => {
          const cart = s.cart.filter((l) => l.key !== key);
          return { ...recompute(cart), cart };
        }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      inWishlist: (id) => get().wishlist.includes(id),
      setCartOpen: (v) => set({ cartOpen: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setQuickView: (p) => set({ quickView: p }),
      setUser: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
    }),
    {
      name: "aura-store",
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, user: s.user }) as State,
    },
  ),
);

function recompute(cart: CartLine[]) {
  let cartCount = 0;
  let subtotal = 0;
  for (const l of cart) {
    const p = getProduct(l.id);
    if (!p) continue;
    cartCount += l.qty;
    subtotal += p.price * l.qty;
  }
  return { cartCount, subtotal };
}
