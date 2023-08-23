import { ReactNode } from 'react';
import { WarningCircle } from 'phosphor-react';

interface BaseFieldProps {
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error: any;
  children?: ReactNode;
}

export function BaseField({
  icon,
  label,
  hint,
  error,
  children,
}: BaseFieldProps) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block body-2 font-bold text-white mb-2 truncate">
          {label}
        </span>
      )}

      <div
        className={`flex gap-2 px-[calc(1rem-1px)] rounded bg-neutral-800 border focus-within:border-white focus-within:bg-neutral-700 ${
          error ? 'border-red-600' : 'border-neutral-700'
        }`}
      >
        {icon && (
          <div className="flex-none text-neutral-500 pt-[calc(1rem-1px)]">
            {icon}
          </div>
        )}
        <div className="flex-1 w-full">{children}</div>
        {error && (
          <div className="flex-none text-red-600 pt-[calc(1rem-1px)]">
            <WarningCircle size={24} />
          </div>
        )}
      </div>

      {error ? (
        <span className="block body-3 text-red-600 mt-2">{error}</span>
      ) : (
        hint && (
          <span className="block body-3 text-neutral-400 mt-2">{hint}</span>
        )
      )}
    </label>
  );
}
