export const FormField = ({ label, htmlFor, labelId, required, error, hint, children, className = "" }) => (
  <div className={className}>
    <label id={labelId} htmlFor={htmlFor} className="mb-2 flex items-center gap-1 text-sm font-semibold text-sb-text">
      {label}
      {required && <span className="text-sb-primary" aria-hidden="true">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-xs text-sb-muted">{hint}</p>}
    {error && (
      <p role="alert" className="mt-1.5 text-xs font-medium text-rose-500" data-testid={`error-${htmlFor || labelId}`}>
        {error}
      </p>
    )}
  </div>
);
