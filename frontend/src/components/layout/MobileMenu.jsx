import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpLeft } from "lucide-react";
import { NAV_ITEMS } from "@/config/site";
import { handleSectionNav } from "@/lib/navigation";

export const MobileMenu = ({ open, pathname, onNavigate }) => (
  <AnimatePresence>
    {open && (
      <motion.nav
        id="mobile-menu"
        aria-label="منوی موبایل"
        data-testid="mobile-menu"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="sb-glass mt-2 rounded-3xl p-3 shadow-[var(--sb-shadow)] lg:hidden"
      >
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                onClick={(e) => {
                  handleSectionNav(e, item.to, pathname);
                  onNavigate();
                }}
                data-testid={`mobile-nav-link-${item.id}`}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-semibold text-sb-text transition-colors hover:bg-sb-surface2"
              >
                {item.label}
                <ArrowUpLeft className="h-4 w-4 text-sb-muted" />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/register" onClick={onNavigate} data-testid="mobile-register-cta" className="sb-btn-primary mt-2 h-12 w-full">
          ثبت باشگاه
        </Link>
      </motion.nav>
    )}
  </AnimatePresence>
);
