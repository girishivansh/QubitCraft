

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
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-navy-800 mb-1.5">
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
        className={`w-full h-11 px-4 rounded-[12px] border text-navy-900 text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
