import { forwardRef } from 'react';

const FormInput = forwardRef(function FormInput(
  { label, id, error, helper, required, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-fg-muted">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`h-10 w-full rounded-lg border px-3 text-sm text-fg bg-[#0F0F12] outline-none
          placeholder:text-fg-muted/50 transition-all duration-200
          focus:ring-2 focus:ring-accent/40 focus:border-accent/60
          ${error
            ? 'border-red-500/40 bg-red-950/20 focus:ring-red-500/25 focus:border-red-500/60'
            : 'border-white/[0.10] hover:border-white/[0.18]'
          } ${className}`}
        {...props}
      />
      {error  && <p className="text-xs text-red-400 flex items-center gap-1.5">⚠ {error}</p>}
      {helper && !error && <p className="text-xs text-fg-muted">{helper}</p>}
    </div>
  );
});

export default FormInput;
