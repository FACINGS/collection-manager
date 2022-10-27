import Head from 'next/head';
import { chainKeyDefault } from '@configs/globalsConfig';
import { isValidChainKey } from '@utils/isValidChainKey';

import { UserCollectionsList } from '@components/collection/UserCollectionsList';

export default function MyCollections({ chainKey }) {
  return (
    <>
      <Head>
        <title>Collection Manager</title>
        <meta name="description" content="NFT Collection Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserCollectionsList chainKey={chainKey} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey } = params;

  if (!isValidChainKey(chainKey)) {
    const destination = chainKeyDefault;

    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return {
    props: {
      chainKey,
    },
  };
}
