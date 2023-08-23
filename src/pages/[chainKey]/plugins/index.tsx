import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { Header } from '@components/Header';
import { PluginsContainer } from '@components/PluginsContainer';

import { appName } from '@configs/globalsConfig';

interface PluginsListProps {
  plugin: string;
  label: string;
  page: string;
  description: string;
}

export default function Plugins({ chainKey }) {
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
    <>
      <Head>
        <title>{`Plugins - ${appName}`}</title>
      </Head>

      <Header.Root border>
        <Header.Content title="Plugins" />
      </Header.Root>

      <main className="container pt-16">
        {(pluginsList.length > 0 || externalPluginsList.length > 0) && (
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <PluginsContainer chainKey={chainKey} plugins={pluginsList} />
              <PluginsContainer
                chainKey={chainKey}
                plugins={externalPluginsList}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const chainKey = query.chainKey as string;

  try {
    return {
      props: {
        chainKey,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
