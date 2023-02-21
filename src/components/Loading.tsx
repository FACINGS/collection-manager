import { CircleNotch } from 'phosphor-react';

export function Loading() {
  return (
    <div className="container mx-auto my-10 flex w-fit h-fit justify-center items-center gap-4 p-4">
      <CircleNotch size={24} weight="bold" className="animate-spin" />
      <p className="text-white font-bold">Loading...</p>
    </div>
  );
}
