

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
    { label: '', color: 'bg-gray-200', text: 'text-transparent' }, // 0 fallback
    { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' },
    { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' },
  ];

  const currentStrength = strengthMap[score > 0 ? score : 0];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5 mb-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 rounded-full flex-1 transition-colors ${
              level <= score ? currentStrength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs ${currentStrength.text}`}>
          {currentStrength.label}
        </p>
      )}
    </div>
  );
}
