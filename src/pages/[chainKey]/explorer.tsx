import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';

import { CollectionItemsList } from '@components/collection/CollectionItemsList';

import { listCollectionsService } from '@services/collection/listCollectionsService';

import * as chainsConfig from '@configs/chainsConfig';
import { appName } from '@configs/globalsConfig';

import { CollectionProps } from '@services/collection/listCollectionsService';

interface ExplorerProps {
  chainKey: string;
  initialCollections: CollectionProps[];
}

export default function Explorer({
  chainKey,
  initialCollections,
}: ExplorerProps) {
  return (
    <>
      <Head>
        <title>{`Explorer - ${appName}`}</title>
      </Head>

      <CollectionItemsList
        chainKey={chainKey}
        initialCollections={initialCollections}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const chainsKeys = Object.keys(chainsConfig);

  const paths = chainsKeys.map((chainKey) => {
    return {
      params: {
        chainKey,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const chainKey = params.chainKey as string;

  try {
    const collections = await listCollectionsService(chainKey, {});

    return {
      props: {
        chainKey,
        initialCollections: collections.data.data,
      },
      revalidate: 60 * 60 * 1, // 1 hour
    };
  } catch (error) {
    return {
      props: {
        chainKey,
        initialCollections: {},
      },
      revalidate: 60 * 60 * 1, // 1 hour
    };
  }
};
