import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  listCollectionsService,
  CollectionProps,
} from '@services/collection/listCollectionsService';
import { ipfsEndpoint, appName } from '@configs/globalsConfig';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { Header } from '@components/Header';

interface CollectionByAuthorProps {
  chainKey: string;
  collections: CollectionProps[];
}

export default function CollectionByAuthor({
  chainKey,
  collections,
}: CollectionByAuthorProps) {
  const author = collections[0].author;

  return (
    <>
      <Head>
        <title>{`${author} - ${appName}`}</title>
      </Head>

      <Header.Root border>
        <Header.Content title={author} subtitle="Collections by" />
      </Header.Root>

      <div className="container mt-4 sm:mt-8">
        <CardContainer>
          {collections.map((collection, index) => (
            <Card
              key={index}
              href={`/${chainKey}/collection/${collection.collection_name}`}
              image={collection.img ? `${ipfsEndpoint}/${collection.img}` : ''}
              title={collection.name}
              subtitle={`by ${collection.author}`}
            />
          ))}
        </CardContainer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params.author) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const chainKey = context.params.chainKey as string;
  const author = context.params.author as string;

  const { data: collections } = await listCollectionsService(chainKey, {
    author,
  });

  return {
    props: {
      chainKey,
      collections: collections.data,
    },
  };
};
