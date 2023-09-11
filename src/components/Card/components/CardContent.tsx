import Image from 'next/image';
import { ImageSquare } from '@phosphor-icons/react';
import Link from 'next/link';

interface CardContentProps {
  id: string;
  image: string;
  video: string;
  title: string;
  subtitle: string;
  saleInfo?: any;
  viewLink?: string;
  withThumbnail: boolean;
}

export function CardContent({
  id,
  image,
  video,
  title,
  subtitle,
  saleInfo,
  viewLink,
  withThumbnail,
}: CardContentProps) {
  return (
    <>
      {saleInfo && saleInfo.assetCount > 1 && (
        <div className="p-2 text-center">
          Bundle ({saleInfo.assetCount} NFTs)
        </div>
      )}
      {saleInfo && saleInfo.assetCount == 1 && (
        <div className="p-2 text-center">Single Sale</div>
      )}

      {!saleInfo && id && <div className="p-2 text-center">#{id}</div>}

      {withThumbnail && (
        <div className="aspect-square bg-zinc-700 relative">
          {video && (
            <video
              muted
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={video} type="video/mp4" />
            </video>
          )}
          {image && (
            <Image
              alt={title}
              src={image}
              fill
              className="object-cover"
              sizes="max-w-lg"
            />
          )}
          {!video && !image && (
            <div className="w-full h-full flex items-center justify-center text-white">
              <ImageSquare size={64} />
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <h4 className="title-1 truncate">{title ?? 'No name'}</h4>
        {subtitle && (
          <p className="body-2 text-zinc-200 truncate">{subtitle}</p>
        )}
        {saleInfo && (
          <p className="body-2 text-zinc-200 truncate">{`${
            Number(saleInfo.listingPrice) /
            Math.pow(10, saleInfo.tokenPrecision)
          } ${saleInfo.token}`}</p>
        )}
        {viewLink && (
          <Link
            href={viewLink}
            className="btn btn-small mt-4 whitespace-nowrap w-full text-center truncate"
            target="_blank"
            onClick={(event) => event.stopPropagation()}
          >
            View {saleInfo ? 'Sale' : 'NFT'}
          </Link>
        )}
      </div>
    </>
  );
}
