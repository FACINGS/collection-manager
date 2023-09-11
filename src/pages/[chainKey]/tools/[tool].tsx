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

interface ToolProps {
  ual: any;
  type: string;
  tool: string;
  chainKey: string;
  collection: CollectionProps;
}

function Tool({ ual, tool, type, collection, chainKey }: ToolProps) {
  const DynamicComponent = dynamic(() =>
    import(`../../../tools/${type}/${tool}`).then((mod) => mod)
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
              collectionTabs[4].name,
              `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[4].key}`,
            ],
            [tool],
          ]}
        ></Header.Root>
      )}

      <DynamicComponent />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const tool = query.tool as string;
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
        tool,
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

export default withUAL(Tool);
