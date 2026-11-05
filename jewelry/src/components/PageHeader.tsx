import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, crumbs }: { title: string; crumbs?: string[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground" aria-label="مسیر">
        <Link to="/" className="hover:text-foreground">خانه</Link>
        {crumbs?.map((c) => (
          <span key={c} className="flex items-center gap-2">
            <ChevronLeft className="h-3 w-3" />
            <span className="text-foreground">{c}</span>
          </span>
        ))}
      </nav>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">{title}</h1>
    </div>
  );
}
