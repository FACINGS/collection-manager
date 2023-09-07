import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { Header } from '@components/Header';
import { ToolsContainer } from '@components/ToolsContainer';

import { appName } from '@configs/globalsConfig';

interface ToolsListProps {
  tool: string;
  label: string;
  page: string;
  description: string;
}

export default function Tools({ chainKey }) {
  const [toolsList, setToolsList] = useState<ToolsListProps[]>([]);

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/tools?path=default');
        const toolNames = await response.json();
        setToolsList(toolNames);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTools();
  }, []);

  return (
    <>
      <Head>
        <title>{`Tools - ${appName}`}</title>
      </Head>

      <Header.Root border>
        <Header.Content title="Tools" />
      </Header.Root>

      <main className="container pt-16">
        {toolsList.length > 0 && (
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <ToolsContainer chainKey={chainKey} tools={toolsList} />
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
