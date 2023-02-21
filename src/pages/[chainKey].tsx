import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { chainKeyDefault, appName } from '@configs/globalsConfig';
import { isValidChainKey } from '@utils/isValidChainKey';

import { UserCollectionsList } from '@components/collection/UserCollectionsList';

interface ChainProps {
  chainKey: string;
}

export default function MyCollections({ chainKey }: ChainProps) {
  return (
    <>
      <Head>
        <title>{appName}</title>
      </Head>

      <UserCollectionsList chainKey={chainKey} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;

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
};
