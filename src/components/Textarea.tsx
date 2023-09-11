import { forwardRef, TextareaHTMLAttributes, ReactNode, Ref } from 'react';
import { BaseField } from '@components/BaseField';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error?: any;
}

function TextareaComponent(
  { icon, label, hint, error, ...props }: TextAreaProps,
  ref: Ref<HTMLTextAreaElement | any>
) {
  return (
    <BaseField icon={icon} label={label} hint={hint} error={error}>
      <textarea
        {...props}
        ref={ref}
        className="w-full block py-[0.875rem] bg-transparent body-1 text-white placeholder:text-zinc-500 focus:outline-none"
      />
    </BaseField>
  );
}

export const Textarea = forwardRef(TextareaComponent);
