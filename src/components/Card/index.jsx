import Link from 'next/link';
import { CardContent } from './components/CardContent';

export function Card({
  href,
  id,
  image,
  video,
  title,
  subtitle,
  withThumbnail = true,
  ...props
}) {
  if (href) {
    return (
      <Link href={href} prefetch={false}>
        <a
          rel="noopener noreferrer"
          className="bg-neutral-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 duration-300"
        >
          <CardContent
            id={id}
            image={image}
            video={video}
            title={title}
            subtitle={subtitle}
            withThumbnail={withThumbnail}
          />
        </a>
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
        withThumbnail={withThumbnail}
      />
    </div>
  );
}
