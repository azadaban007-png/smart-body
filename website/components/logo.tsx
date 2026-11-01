export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      dir="ltr"
      className={`font-serif font-light leading-none ${className ?? ''}`}
    >
      SG
    </span>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-3" dir="ltr">
      <Monogram className="text-4xl tracking-tighter" />
      <span className="hidden flex-col sm:flex">
        <span className="font-serif text-lg uppercase leading-tight tracking-[0.18em]">
          Shadi Ghader
        </span>
        <span className="text-[0.5rem] uppercase tracking-[0.28em] opacity-70">
          Architecture &amp; Interior Design
        </span>
      </span>
    </span>
  )
}
