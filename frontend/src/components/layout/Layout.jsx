import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTheme } from "@/context/ThemeContext";

export const Layout = () => {
  const { pathname, hash } = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return undefined;
    }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-sb-primary focus:px-4 focus:py-2 focus:text-white">
        پرش به محتوا
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" dir="rtl" theme={theme} richColors toastOptions={{ style: { fontFamily: "Vazirmatn, sans-serif" } }} />
    </>
  );
};
