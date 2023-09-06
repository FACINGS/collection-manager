import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { withUAL } from 'ual-reactjs-renderer';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { listCollectionsService } from '@services/collection/listCollectionsService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { Input } from '@components/Input';
import { CreateNewItem } from '@components/collection/CreateNewItem';
import { Loading } from '@components/Loading';
import { Header } from '@components/Header';

interface UserCollectionsListComponentProps {
  chainKey: string;
  ual: {
    activeUser: {
      accountName: string;
    };
    showModal: () => void;
  };
}

function UserCollectionsListComponent({
  chainKey,
  ual,
}: UserCollectionsListComponentProps) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [match, setMatch] = useState('');
  const [waitToSearch, setWaitToSearch] = useState(null);

  const limit = 12;
  const currentPage = Math.ceil(collections.length / limit) || 1;
  const offset = (currentPage - 1) * limit;
  const isEndOfList = collections.length % limit > 0;

  const author = ual?.activeUser?.accountName;

  const handleLoadCollections = useCallback(
    async (page) => {
      setIsLoading(true);

      try {
        const { data } = await listCollectionsService(chainKey, {
          match,
          page,
          offset,
          authorizedAccount: author,
        });

        setCollections((state) => [...state, ...data.data]);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    },
    [match, author, offset, chainKey]
  );

  useEffect(() => {
    if (author && currentPage === 1 && collections.length === 0 && isLoading) {
      handleLoadCollections(currentPage);
    }
  }, [author, currentPage, collections, isLoading, handleLoadCollections]);

  function handleLogin() {
    ual?.showModal();
  }

  // async function handleSearch(event) {
  //   const { value } = event.target;
  //   clearTimeout(waitToSearch);

  //   const newWaitToSearch = setTimeout(async () => {
  //     const { data: collections } = await listCollectionsService(chainKey, {
  //       match: value || '',
  //       authorizedAccount: author,
  //     });
  //     setMatch(value);
  //     setCollections(collections.data);
  //   });

  //   setWaitToSearch(newWaitToSearch);
  // }

  if (author) {
    return (
      <>
        <Header.Root border>
          <Header.Content title="My Collections" />
          {/* <Header.Search>
            <Input
              icon={<MagnifyingGlass size={24} />}
              type="search"
              placeholder="Search collection"
              onChange={handleSearch}
            />
          </Header.Search> */}
        </Header.Root>

        <section className="container py-8">
          {collections.length > 0 ? (
            <>
              <CardContainer>
                <CreateNewItem
                  href={`/${chainKey}/collection/new`}
                  label="Create Collection"
                />
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
                    onClick={() => handleLoadCollections(currentPage + 1)}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <CreateNewItem
                  href={`/${chainKey}/collection/new`}
                  label="Create your first collection"
                />
              )}
            </>
          )}
        </section>
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-5.5rem-5.5rem-5.25rem)] md:h-[calc(100vh-5.5rem-5.375rem)] flex items-center justify-center">
      <div className="md:max-w-lg lg:max-w-3xl text-center px-4">
        <h2 className="headline-1">NFT Manager</h2>
        <p className="body-1 mt-4 mb-8">
          Connect your wallet to get access to the collection manager and other
          useful tools!
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <button type="button" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
          <>
            {'xpr' == chainKey ? (
              <Link
                href={`https://soon.market/explore?utm_medium=frontpage&utm_source=nft-manager`}
                className="btn border-0"
                target="_blank"
              >
                Explore on Soon.Market
              </Link>
            ) : (
              <Link href={`/${chainKey}/explorer`} className="btn border-0">
                Explorer
              </Link>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export const UserCollectionsList = withUAL(UserCollectionsListComponent);
