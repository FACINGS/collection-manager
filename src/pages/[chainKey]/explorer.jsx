import Head from 'next/head';

import { CollectionItemsList } from '@components/collection/CollectionItemsList';

import { listCollectionsService } from '@services/collection/listCollectionsService';

import * as chainsConfig from '@configs/chainsConfig';

export default function Explorer({ chainKey, initialCollections }) {
  return (
    <>
      <Head>
        <title>Explorer - Collection Manager</title>
        <meta name="description" content="NFT Collection Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CollectionItemsList
        chainKey={chainKey}
        initialCollections={initialCollections}
      />
    </>
  );
}

export async function getStaticPaths() {
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
}

export async function getStaticProps({ params }) {
  const { chainKey } = params;

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
}
