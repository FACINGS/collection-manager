import Link from 'next/link';
import { CardContent } from './components/CardContent';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  href?: string;
  target?: string;
  id?: string;
  image?: string;
  video?: string;
  title?: string;
  subtitle?: string;
  saleInfo?: any;
  viewLink?: string;
  withThumbnail?: boolean;
}

export function Card({
  href,
  target,
  id,
  image,
  video,
  title,
  subtitle,
  saleInfo,
  viewLink,
  withThumbnail = true,
  ...props
}: CardProps) {
  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={`bg-neutral-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 duration-300 ${
          !id && 'flex flex-col justify-end'
        }`}
        target={target}
      >
        <CardContent
          id={id}
          image={image}
          video={video}
          title={title}
          subtitle={subtitle}
          withThumbnail={withThumbnail}
        />
      </Link>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden" {...props}>
      <CardContent
        id={id}
        image={image}
        video={video}
        title={title}
        subtitle={subtitle}
        saleInfo={saleInfo}
        viewLink={viewLink}
        withThumbnail={withThumbnail}
      />
    </div>
  );
}
