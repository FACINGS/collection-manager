import { useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { listCollectionsService } from '@services/collection/listCollectionsService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { Input } from '@components/Input';
import { Loading } from '@components/Loading';

export function CollectionItemsList({ chainKey, initialCollections }) {
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
      <header className="border-b border-neutral-700">
        <div className="container py-4 md:py-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-8 items-center">
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <h1 className="headline-1">Explorer</h1>
          </div>
          <div className="col-span-1 md:col-span-1 xl:col-span-1">
            <Input
              icon={<MagnifyingGlass size={24} />}
              type="search"
              placeholder="Search collection"
              onChange={handleSearch}
            />
          </div>
        </div>
      </header>

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
              <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                <h4 className="title-1">Collections not found</h4>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
