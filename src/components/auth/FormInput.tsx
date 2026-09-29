

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  id: string;
}

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
  id,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-navy-800 dark:text-slate-200 mb-0.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full h-9 px-3.5 rounded-[10px] border bg-white dark:bg-[#0d0e24] text-navy-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:text-gray-400 dark:disabled:text-slate-600 ${
          error
            ? 'border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
            : 'border-gray-200 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
        }`}
      />
      {error && <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
