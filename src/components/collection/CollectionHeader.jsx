import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ImageSquare } from 'phosphor-react';
import { withUAL } from 'ual-reactjs-renderer';

import { ipfsEndpoint } from '@configs/globalsConfig';

function CollectionHeaderComponent({
  ual,
  name,
  author,
  image,
  link,
  collection,
}) {
  const router = useRouter();
  const isOwner = ual && author && ual?.activeUser?.accountName === author;

  return (
    <header
      className="container items-center overflow-x-hidden sm:overflow-x-visible
        py-8 md:py-12 lg:py-16
        grid grid-cols-4 gap-4
        md:grid-cols-6 md:gap-6
        lg:grid-cols-12 lg:gap-8"
    >
      <div className="col-span-4 lg:col-span-7 order-last md:order-first">
        <p className="headline-3 lg:mb-2">Collection</p>
        <h1 className="headline-1">{name ?? 'No name'}</h1>
        <div className="flex flex-wrap gap-4 mt-4 lg:mt-8">
          {isOwner ? (
            <Link
              href={`/${router.query.chainKey}/collection/${collection}/edit`}
            >
              <a className="btn">Edit Collection</a>
            </Link>
          ) : (
            <Link href={`/${router.query.chainKey}/author/${author}`}>
              <a className="btn">By {author}</a>
            </Link>
          )}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Website
          </a>
        </div>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-5 xl:col-span-4">
        <div className="relative w-full aspect-square">
          {image ? (
            <>
              <Image
                alt={name}
                src={`${ipfsEndpoint}/${image}`}
                layout="fill"
                objectFit="contain"
              />
              <div
                className="absolute blur-3xl -z-10
                  w-[calc(100%+4rem)] h-[calc(100%+4rem)] -left-[2rem] -top-[2rem]
                  md:w-[calc(100%+6rem)] md:h-[calc(100%+6rem)] md:-left-[3rem] md:-top-[3rem]
                  lg:w-[calc(100%+8rem)] lg:h-[calc(100%+8rem)] lg:-left-[4rem] lg:-top-[4rem]"
              >
                <Image
                  alt={name}
                  src={`${ipfsEndpoint}/${image}`}
                  layout="fill"
                  objectFit="fill"
                  quality={1}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-700 text-white rounded-xl">
              <ImageSquare size={64} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export const CollectionHeader = withUAL(CollectionHeaderComponent);
