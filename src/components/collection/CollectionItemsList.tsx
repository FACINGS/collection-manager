import { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { ipfsEndpoint } from '@configs/globalsConfig';
import {
  listCollectionsService,
  CollectionProps,
} from '@services/collection/listCollectionsService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { Input } from '@components/Input';
import { Loading } from '@components/Loading';
import { Header } from '@components/Header';

interface CollectionItemsListProps {
  chainKey: string;
  initialCollections: CollectionProps[];
}

export function CollectionItemsList({
  chainKey,
  initialCollections,
}: CollectionItemsListProps) {
  const [collections, setCollections] = useState(initialCollections);
  const [isLoading, setIsLoading] = useState(false);
  const [match, setMatch] = useState('');
  const [waitToSearch, setWaitToSearch] = useState(null);

  const limit = 12;
  const currentPage = Math.ceil(collections.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = collections.length % limit > 0;

  async function handleLoadCollections() {
    setIsLoading(true);

    try {
      const { data } = await listCollectionsService(chainKey, {
        match,
        page: currentPage + 1,
        limit,
        offset,
      });

      setCollections((state) => [...state, ...data.data]);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  async function handleSearch(event) {
    const { value } = event.target;
    clearTimeout(waitToSearch);

    const newWaitToSearch = setTimeout(async () => {
      const { data: collections } = await listCollectionsService(chainKey, {
        match: value || '',
      });

      setMatch(value);
      setCollections(collections.data);
    }, 500);

    setWaitToSearch(newWaitToSearch);
  }

  return (
    <>
      <Header.Root border>
        <Header.Content title="Explorer" />
        <Header.Search>
          <Input
            icon={<MagnifyingGlass size={24} />}
            type="search"
            placeholder="Search collection"
            onChange={handleSearch}
          />
        </Header.Search>
      </Header.Root>

      <section className="container py-8">
        {collections.length > 0 ? (
          <>
            <CardContainer>
              {collections.map((collection, index) => (
                <Card
                  key={index}
                  href={`/${chainKey}/collection/${collection.collection_name}`}
                  image={
                    collection.img ? `${ipfsEndpoint}/${collection.img}` : ''
                  }
                  title={collection.name}
                  subtitle={`by ${collection.author}`}
                />
              ))}
            </CardContainer>
            {!isEndOfList && (
              <div className="flex justify-center mt-8">
                <SeeMoreButton
                  isLoading={isLoading}
                  onClick={handleLoadCollections}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="bg-zinc-800 px-8 py-24 text-center rounded-xl">
                <h4 className="title-1">Collections not found</h4>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
