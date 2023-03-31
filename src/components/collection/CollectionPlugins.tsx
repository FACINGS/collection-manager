import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collectionTabs } from '@utils/collectionTabs';

interface CollectionPluginsProps {
  chainKey: string;
  collectionName: string;
}

interface PluginsListProps {
  plugin: string;
  label: string;
}

export function CollectionPlugins({
  chainKey,
  collectionName,
}: CollectionPluginsProps) {
  const [pluginsList, setPluginsList] = useState<PluginsListProps[]>([]);
  const [externalPluginsList, setExternalPluginsList] = useState<
    PluginsListProps[]
  >([]);

  useEffect(() => {
    async function fetchPlugins() {
      try {
        const response = await fetch('/api/plugins?path=default');
        const pluginNames = await response.json();
        setPluginsList(pluginNames);

        const res = await fetch('/api/plugins?path=external');
        const externalPluginNames = await res.json();
        setExternalPluginsList(externalPluginNames);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlugins();
  }, []);

  return (
    <section className="container">
      <div className="flex flex-col py-8 gap-12">
        <h2 className="headline-2">{collectionTabs[5].name}</h2>
      </div>
      {(pluginsList.length > 0 || externalPluginsList.length > 0) && (
        <div className="flex-1">
          <div className="flex md:flex-row flex-col gap-8">
            {pluginsList.map((item) => (
              <Link
                key={item.plugin}
                href={{
                  pathname: `/${chainKey}/collection/${collectionName}/plugins/${item.plugin}`,
                  query: { type: 'default' },
                }}
                className="flex flex-row w-full max-w-xs justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 py-8 px-16"
              >
                <span className="title-1">{item.label}</span>
              </Link>
            ))}
            {externalPluginsList.map((item) => (
              <Link
                key={item.plugin}
                href={`/${chainKey}/collection/${collectionName}/plugins/${item.plugin}?type=external`}
                className="flex flex-row w-full max-w-xs justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 py-8 px-16"
              >
                <span className="title-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
