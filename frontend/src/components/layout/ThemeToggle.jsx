import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = ({ onHero = false }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="theme-toggle"
      aria-label={dark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
      aria-pressed={dark}
      className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border transition-colors duration-300 ${
        onHero ? "border-white/20 text-white hover:bg-white/10" : "border-sb-border text-sb-text hover:border-sb-primary hover:text-sb-primary"
      }`}
    >
      <Sun className={`absolute h-[18px] w-[18px] transition-[transform,opacity] duration-500 ${dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute h-[18px] w-[18px] transition-[transform,opacity] duration-500 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
    </button>
  );
};
