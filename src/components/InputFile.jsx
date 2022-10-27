import { forwardRef } from 'react';
import { BaseField } from '@components/BaseField';
import { File } from 'phosphor-react';

function InputFileComponent({ label, hint, error, ...props }, ref) {
  return (
    <BaseField
      icon={<File size={24} weight="bold" />}
      label={label}
      hint={hint}
      error={error}
    >
      <input
        {...props}
        ref={ref}
        type="file"
        className="w-full block py-[calc(1rem-1px)] body-1 text-white focus:outline-none
        file:mr-4 file:p-0
         file:font-bold file:text-white file:bg-transparent file:border-0"
      />
    </BaseField>
  );
}

export const InputFile = forwardRef(InputFileComponent);
