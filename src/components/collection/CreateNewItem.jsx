import Link from 'next/link';
import { PlusCircle } from 'phosphor-react';

export function CreateNewItem({ label, href, horizontal }) {
  return (
    <Link href={href}>
      <a
        className={`flex justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 ${
          horizontal ? 'p-5' : 'flex-col py-16'
        }`}
      >
        <PlusCircle size={horizontal ? 40 : 64} />
        <span className="title-1">{label}</span>
      </a>
    </Link>
  );
}
