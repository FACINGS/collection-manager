import { ipfsEndpoint } from '@configs/globalsConfig';
import { listCollectionsService } from '@services/collection/listCollectionsService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';

export default function CollectionByAuthor({ chainKey, collections }) {
  const author = collections[0].author;

  return (
    <>
      <header className="py-32 border-b border-neutral-700">
        <div className="container">
          <p className="headline-3 mb-2">Collections by</p>
          <h1 className="headline-1">{author}</h1>
        </div>
      </header>
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

export async function getServerSideProps(context) {
  if (!context.params.author) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { chainKey, author } = context.params;

  const { data: collections } = await listCollectionsService(chainKey, {
    author,
  });

  return {
    props: {
      chainKey,
      collections: collections.data,
    },
  };
}
