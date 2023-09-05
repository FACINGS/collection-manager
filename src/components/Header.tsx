import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react';
import { ReactNode } from 'react';

import { Carousel } from '@components/Carousel';

interface HeaderRootProps {
  border?: boolean;
  breadcrumb?: Array<string[]>;
  children?: ReactNode;
}

interface HeaderContentProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

interface HeaderSearchProps {
  children?: ReactNode;
}

interface HeaderBannerProps {
  unique?: boolean;
  images?: {
    ipfs: string;
    type: string;
  }[];
}

function HeaderRoot({ border, breadcrumb, children }: HeaderRootProps) {
  return (
    <header
      className={`${breadcrumb ? 'pb-4 md:pb-8' : 'py-4 md:py-8'} ${
        border ? 'border-b border-neutral-700' : ''
      }`}
    >
      {breadcrumb && (
        <nav className="container py-2" aria-label="Breadcrumb">
          <ul className="flex flex-wrap gap-2 items-center body-2 font-bold">
            {breadcrumb.map(([label, href], index) => (
              <li
                key={index}
                className="flex gap-2 items-center text-neutral-400"
              >
                {index !== 0 && <CaretRight size={16} weight="bold" />}
                {href ? (
                  <Link
                    href={href}
                    className="block text-neutral-400 hover:text-white py-2"
                  >
                    {label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="container flex gap-4 md:gap-8 flex-col md:flex-row md:items-center overflow-x-hidden sm:overflow-x-visible">
        {children}
      </div>
    </header>
  );
}

function HeaderContent({ title, subtitle, children }: HeaderContentProps) {
  return (
    <div className="flex-1">
      {subtitle && <p className="title-1">{subtitle}</p>}
      <h1 className="headline-1">{title ?? 'No name'}</h1>
      {children}
    </div>
  );
}

function HeaderSearch({ children }: HeaderSearchProps) {
  return <div className="flex-1 md:max-w-[16rem]">{children}</div>;
}

function HeaderBanner({ images, unique }: HeaderBannerProps) {
  return (
    <div className="flex-1">
      <Carousel images={images} unique={unique} />
    </div>
  );
}

export const Header = {
  Root: HeaderRoot,
  Content: HeaderContent,
  Banner: HeaderBanner,
  Search: HeaderSearch,
};
