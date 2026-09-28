import { forwardRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ScrollControls = ({ scroller, testIdPrefix, className = "" }) => (
  <div className={`hidden items-center gap-2 sm:flex ${className}`}>
    <button type="button" onClick={scroller.prev} disabled={scroller.atStart} aria-label="قبلی" data-testid={`${testIdPrefix}-prev`} className="sb-round-btn">
      <ChevronRight className="h-5 w-5" />
    </button>
    <button type="button" onClick={scroller.next} disabled={scroller.atEnd} aria-label="بعدی" data-testid={`${testIdPrefix}-next`} className="sb-round-btn">
      <ChevronLeft className="h-5 w-5" />
    </button>
  </div>
);

export const ScrollTrack = forwardRef(({ children, label, testId, className = "" }, ref) => (
  <div
    ref={ref}
    role="list"
    aria-label={label}
    data-testid={testId}
    className={`sb-bleed no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${className}`}
  >
    {children}
  </div>
));

ScrollTrack.displayName = "ScrollTrack";
