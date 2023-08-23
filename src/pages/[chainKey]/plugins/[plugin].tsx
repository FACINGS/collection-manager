import { withUAL } from 'ual-reactjs-renderer';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import { Header } from '@components/Header';

import { collectionTabs } from '@utils/collectionTabs';
import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';

interface PluginProps {
  ual: any;
  type: string;
  plugin: string;
  chainKey: string;
  collection: CollectionProps;
}

function Plugin({ ual, plugin, type, collection, chainKey }: PluginProps) {
  const DynamicComponent = dynamic(() =>
    import(`../../../plugins/${type}/${plugin}`).then((mod) => mod)
  );

  const hasAuthorization = isAuthorizedAccount(ual, collection) as boolean;

  return (
    <>
      {collection && (
        <Header.Root
          breadcrumb={[
            [
              hasAuthorization ? 'My Collections' : 'Explorer',
              hasAuthorization ? `/${chainKey}` : `/${chainKey}/explorer`,
            ],
            [
              collection.collection_name,
              `/${chainKey}/collection/${collection.collection_name}`,
            ],
            [
              collectionTabs[5].name,
              `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[5].key}`,
            ],
            [plugin],
          ]}
        ></Header.Root>
      )}

      <DynamicComponent />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const plugin = query.plugin as string;
  const type = query.type as string;
  const chainKey = query.chainKey as string;
  const collectionName = query.collection as string;

  try {
    let collectionData;

    if (collectionName) {
      const { data: collection } = await getCollectionService(chainKey, {
        collectionName,
      });

      collectionData = collection.data;
    }

    return {
      props: {
        type,
        plugin,
        chainKey,
        collection: collectionData || null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Plugin);
