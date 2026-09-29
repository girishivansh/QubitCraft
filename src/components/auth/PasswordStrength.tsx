

interface PasswordStrengthProps {
  password?: string;
}

export default function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const strengthMap = [
    { label: '', color: 'bg-gray-200 dark:bg-slate-800', text: 'text-transparent' }, // 0 fallback
    { label: 'Weak', color: 'bg-red-500', text: 'text-red-500 dark:text-red-400' },
    { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500 dark:text-amber-400' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500 dark:text-blue-400' },
    { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500 dark:text-emerald-400' },
  ];

  const currentStrength = strengthMap[score > 0 ? score : 0];

  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 rounded-full flex-1 transition-colors ${
              level <= score ? currentStrength.color : 'bg-gray-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-[11px] font-medium leading-none ${currentStrength.text}`}>
          {currentStrength.label}
        </p>
      )}
    </div>
  );
}
