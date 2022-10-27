import { Check, X, Minus } from 'phosphor-react';
import { Switch as SwitchComponent, Transition } from '@headlessui/react';

export function Switch({ label, hint, checked, onChange }) {
  if (typeof checked === 'undefined') {
    return (
      <div className="flex items-center gap-4" onClick={() => onChange(false)}>
        <button className="flex-none flex justify-center items-center h-8 w-14 rounded-full border border-neutral-700 focus:outline-none focus:border-white bg-neutral-800">
          <div className="flex justify-center items-center h-6 w-6 rounded-full bg-white text-neutral-900">
            <Minus size={16} weight="bold" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <SwitchComponent.Group
      as="div"
      className={`${label ? 'w-full' : ''} flex items-center gap-4`}
    >
      <SwitchComponent
        name="isTransferable"
        checked={checked}
        onChange={onChange}
        className={`flex-none flex items-center h-8 w-14 rounded-full border border-neutral-700 focus:outline-none focus:border-white ${
          checked ? 'bg-neutral-700' : 'bg-neutral-800'
        }`}
      >
        <span className="sr-only">{label}</span>
        <div
          className={`flex justify-center items-center h-6 w-6 transform rounded-full bg-white text-neutral-900 transition ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        >
          <Transition
            show={checked}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Check size={16} weight="bold" />
          </Transition>
          <Transition
            show={!checked}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <X size={16} weight="bold" />
          </Transition>
        </div>
      </SwitchComponent>
      {label && (
        <SwitchComponent.Label className="flex-1">
          <span className="block body-1 font-bold text-white">{label}</span>
          {hint && (
            <span className="block body-2 text-neutral-400">{hint}</span>
          )}
        </SwitchComponent.Label>
      )}
    </SwitchComponent.Group>
  );
}
