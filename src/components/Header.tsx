import Image from 'next/image';
import Link from 'next/link';
import { ImageSquare, CaretRight } from 'phosphor-react';
import { ReactNode } from 'react';

import { ipfsEndpoint } from '@configs/globalsConfig';

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
  imageIpfs?: string;
  videoIpfs?: string;
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

function HeaderBanner({ imageIpfs, videoIpfs }: HeaderBannerProps) {
  return (
    <div className="flex-1">
      <div className="relative w-full md:max-w-[14rem] lg:max-w-sm mx-auto aspect-square">
        {imageIpfs ? (
          <>
            <Image
              src={`${ipfsEndpoint}/${imageIpfs}`}
              fill
              className="object-contain"
              sizes="max-w-lg"
              alt=""
            />
            <div className="absolute blur-3xl -z-10 w-[calc(100%+4rem)] h-[calc(100%+4rem)] -left-[2rem] -top-[2rem] hidden md:block">
              <Image
                src={`${ipfsEndpoint}/${imageIpfs}`}
                fill
                className="object-contain"
                quality={1}
                alt=""
                sizes="max-w-2xl"
                priority
              />
            </div>
          </>
        ) : videoIpfs ? (
          <video
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={`${ipfsEndpoint}/${videoIpfs}`} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-700 text-white rounded-xl">
            <ImageSquare size={64} />
          </div>
        )}
      </div>
    </div>
  );
}

export const Header = {
  Root: HeaderRoot,
  Content: HeaderContent,
  Banner: HeaderBanner,
  Search: HeaderSearch,
};
