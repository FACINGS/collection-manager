import { useState, Fragment } from 'react';
import { BaseField } from '@components/BaseField';
import { Listbox, Transition } from '@headlessui/react';
import { CaretDown } from 'phosphor-react';

export function Select({
  icon,
  label,
  hint,
  error,
  onChange,
  selectedValue,
  options,
}) {
  const [selected, setSelected] = useState(selectedValue);

  const selectedOption = options.find((option) => option.value === selected);

  function handleChange(value) {
    setSelected(value);
    onChange(value);
  }

  return (
    <Listbox
      as="div"
      className="relative"
      value={selected}
      onChange={handleChange}
    >
      <BaseField icon={icon} label={label} hint={hint} error={error}>
        <Listbox.Button className="flex gap-1 w-full text-left py-[0.875rem] bg-transparent body-1 text-white placeholder:text-neutral-500 focus:outline-none">
          <span className="flex-1 truncate">{selectedOption?.label}</span>
          <CaretDown size={24} className="flex-none" aria-hidden="true" />
        </Listbox.Button>
      </BaseField>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute py-2 mt-1 max-h-60 w-full overflow-auto rounded bg-neutral-800 border border-neutral-700 body-2 focus:outline-none z-10">
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className="py-2 px-8 ui-active:bg-neutral-700"
            >
              <span className="ui-selected:font-bold">{option.label}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
