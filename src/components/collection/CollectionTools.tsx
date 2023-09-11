import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collectionTabs } from '@utils/collectionTabs';

interface CollectionToolsProps {
  chainKey: string;
  collectionName: string;
}

interface ToolsListProps {
  tool: string;
  label: string;
  page: string;
}

export function CollectionTools({
  chainKey,
  collectionName,
}: CollectionToolsProps) {
  const [toolsList, setToolsList] = useState<ToolsListProps[]>([]);
  const [externalToolsList, setExternalToolsList] = useState<ToolsListProps[]>(
    []
  );

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/tools?path=default');
        const toolNames = await response.json();
        setToolsList(toolNames);

        const res = await fetch('/api/tools?path=external');
        const externalToolNames = await res.json();
        setExternalToolsList(externalToolNames);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTools();
  }, []);

  return (
    <section className="container">
      <div className="flex flex-col py-8 gap-12">
        <h2 className="headline-2">{collectionTabs[4].name}</h2>
      </div>
      {(toolsList.length > 0 || externalToolsList.length > 0) && (
        <div className="flex-1">
          <div className="flex md:flex-row flex-col gap-8">
            {toolsList.map((item) => {
              if (item.page === 'collection') {
                return (
                  <Link
                    key={item.tool}
                    href={{
                      pathname: `/${chainKey}/tools/${item.tool}`,
                      query: { type: 'default', collection: collectionName },
                    }}
                    className="flex flex-row w-full max-w-xs justify-center items-center gap-md bg-zinc-800 rounded-xl cursor-pointer hover:scale-105 duration-300 py-8 px-16"
                  >
                    <span className="title-1">{item.label}</span>
                  </Link>
                );
              }
            })}
            {externalToolsList.map((item) => {
              if (item.page === 'collection') {
                return (
                  <Link
                    key={item.tool}
                    href={{
                      pathname: `/${chainKey}/tools/${item.tool}`,
                      query: { type: 'external', collection: collectionName },
                    }}
                    className="flex flex-row w-full max-w-xs justify-center items-center gap-md bg-zinc-800 rounded-xl cursor-pointer hover:scale-105 duration-300 py-8 px-16"
                  >
                    <span className="title-1">{item.label}</span>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </section>
  );
}
