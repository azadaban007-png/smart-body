import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer, SearchOverlay, QuickViewModal } from "@/components/Overlays";
import { Home } from "@/routes/Home";
import { Shop } from "@/routes/Shop";
import { Product } from "@/routes/Product";
import { Cart } from "@/routes/Cart";
import { Checkout } from "@/routes/Checkout";
import { Account } from "@/routes/Account";
import { SignIn } from "@/routes/SignIn";
import { Wishlist } from "@/routes/Wishlist";
import { Journal } from "@/routes/Journal";
import { Search } from "@/routes/Search";

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <QuickViewModal />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: Shop,
  validateSearch: (search: Record<string, unknown>) => ({
    material: typeof search.material === "string" ? search.material : undefined,
    collection: typeof search.collection === "string" ? search.collection : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: Product,
});

const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: "/cart", component: Cart });
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: "/checkout", component: Checkout });
const accountRoute = createRoute({ getParentRoute: () => rootRoute, path: "/account", component: Account });
const signinRoute = createRoute({ getParentRoute: () => rootRoute, path: "/signin", component: SignIn });
const wishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: "/wishlist", component: Wishlist });
const journalRoute = createRoute({ getParentRoute: () => rootRoute, path: "/journal", component: Journal });

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: Search,
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  accountRoute,
  signinRoute,
  wishlistRoute,
  journalRoute,
  searchRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
