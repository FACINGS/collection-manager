import Link from 'next/link';
import { collectionTabs } from '@utils/collectionTabs';
import { collectionPlugins } from '@plugins/pluginsConfig';

interface CollectionPluginsProps {
  chainKey: string;
  collectionName: string;
}

export function CollectionPlugins({
  chainKey,
  collectionName,
}: CollectionPluginsProps) {
  return (
    <section className="container">
      <div className="flex flex-col py-8 gap-12">
        <h2 className="headline-2">{collectionTabs[5].name}</h2>
      </div>

      <div className="flex flex-row gap-8">
        {collectionPlugins &&
          Object.keys(collectionPlugins).map((plugin) => (
            <Link
              key={plugin}
              href={`/${chainKey}/collection/${collectionName}/plugins/${plugin}`}
              className="flex flex-row justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 py-8 px-16"
            >
              <span className="title-1">{collectionPlugins[plugin].name}</span>
            </Link>
          ))}
      </div>
    </section>
  );
}
