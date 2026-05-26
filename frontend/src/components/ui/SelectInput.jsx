import { forwardRef } from 'react';

const SelectInput = forwardRef(function SelectInput(
  { label, id, error, required, placeholder, options = [], className = '', ...props },
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
      <select
        ref={ref}
        id={id}
        className={`h-10 w-full rounded-lg border px-3 text-sm text-fg bg-[#0F0F12] outline-none
          transition-all duration-200 cursor-pointer appearance-none
          focus:ring-2 focus:ring-accent/40 focus:border-accent/60
          ${error
            ? 'border-red-500/40 focus:ring-red-500/25 focus:border-red-500/60'
            : 'border-white/[0.10] hover:border-white/[0.18]'
          } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238A8F98' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '32px',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 flex items-center gap-1.5">⚠ {error}</p>}
    </div>
  );
});

export default SelectInput;
