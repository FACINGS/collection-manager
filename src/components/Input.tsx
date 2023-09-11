import { forwardRef, ReactNode, Ref, InputHTMLAttributes } from 'react';
import { BaseField } from '@components/BaseField';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error?: any;
}

function InputComponent(
  { icon, label, hint, error, ...props }: InputProps,
  ref: Ref<HTMLInputElement | any>
) {
  return (
    <BaseField icon={icon} label={label} hint={hint} error={error}>
      <input
        {...props}
        ref={ref}
        className="w-full block py-[0.875rem] bg-transparent body-1 text-white placeholder:text-zinc-500 focus:outline-none"
      />
    </BaseField>
  );
}

export const Input = forwardRef(InputComponent);
