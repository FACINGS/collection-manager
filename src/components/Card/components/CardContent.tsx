import Image from 'next/image';
import { ImageSquare } from 'phosphor-react';

interface CardContentProps {
  id: string;
  image: string;
  video: string;
  title: string;
  subtitle: string;
  withThumbnail: boolean;
}

export function CardContent({
  id,
  image,
  video,
  title,
  subtitle,
  withThumbnail,
}: CardContentProps) {
  return (
    <>
      {id && (
        <div className="p-2 text-center">
          <h3 className="title-1">#{id}</h3>
        </div>
      )}

      {withThumbnail && (
        <div className="aspect-square bg-neutral-700 relative">
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
          <p className="body-2 text-neutral-200 truncate">{subtitle}</p>
        )}
      </div>
    </>
  );
}
