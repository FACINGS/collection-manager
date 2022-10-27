import { forwardRef } from 'react';
import { BaseField } from '@components/BaseField';

function TextareaComponent({ icon, label, hint, error, ...props }, ref) {
  return (
    <BaseField icon={icon} label={label} hint={hint} error={error}>
      <textarea
        {...props}
        ref={ref}
        className="w-full block py-[0.875rem] bg-transparent body-1 text-white placeholder:text-neutral-500 focus:outline-none"
      />
    </BaseField>
  );
}

export const Textarea = forwardRef(TextareaComponent);
