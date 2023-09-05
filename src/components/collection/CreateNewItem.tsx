import Link from 'next/link';
import { PlusCircle } from '@phosphor-icons/react';

interface CreateNewItemProps {
  label: string;
  href: string;
  horizontal?: boolean;
}

export function CreateNewItem({ label, href, horizontal }: CreateNewItemProps) {
  return (
    <Link
      href={href}
      className={`flex justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 ${
        horizontal ? 'p-5' : 'flex-col py-16'
      }`}
    >
      <PlusCircle size={horizontal ? 40 : 64} />
      <span className="title-1">{label}</span>
    </Link>
  );
}
