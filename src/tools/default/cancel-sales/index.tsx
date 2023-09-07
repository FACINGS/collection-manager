import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircleNotch } from '@phosphor-icons/react';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';

import { useForm } from 'react-hook-form';

import { Card } from '@components/Card';
import { Modal } from '@components/Modal';
import { Select } from '@components/Select';
import { Loading } from '@components/Loading';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { Header } from '@components/Header';

import chainsConfig from '@configs/chainsConfig';
import { ipfsEndpoint, chainKeyDefault, appName } from '@configs/globalsConfig';

import { SaleProps, getSalesService } from '@services/sales/getSalesService';
import { getAccountStatsService } from '@services/account/getAccountStatsService';
import { CancelSalesAssetService } from '@services/asset/masscancelSalesService';

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

function CancelSales({ ual }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { handleSubmit } = useForm({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSales, setSelectedSales] = useState<SaleProps[]>([]);
  const [ownedCollections, setOwnedCollections] = useState([]);
  const [collectionsFilterOptions, setCollectionsFilterOptions] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const chainKey = (router.query.chainKey ?? chainKeyDefault) as string;

  const chainIdLogged =
    ual?.activeUser?.chainId ?? ual?.activeUser?.chain.chainId;

  const chainId = chainsConfig[chainKey].chainId;

  const limit = 12;
  const currentPage = Math.ceil(filteredSales.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = filteredSales.length % limit > 0;

  const accountName = ual?.activeUser?.accountName;

  const getViewLink = (sale) => {
    if (chainKey == 'xpr') {
      return `https://soon.market/sales/${sale.sale_id}`;
    }
    return undefined;
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data: sales } = await getSalesService(chainKey, {
          owner: accountName,
        });

        const { data: collections } = await getAccountStatsService(
          chainKey,
          accountName
        );

        setFilteredSales(sales.data);
        setOwnedCollections(collections.data['collections']);
      } catch (e) {
        modalRef.current?.openModal();
        const jsonError = JSON.parse(JSON.stringify(e));
        const details = JSON.stringify(e, undefined, 2);
        const message =
          jsonError?.cause?.json?.error?.details[0]?.message ??
          'Unable to get user sales or collections';

        setModal({
          title: 'Error',
          message,
          details,
        });
      }
    }

    if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
      getUserInfo();
    }
  }, [chainKey, chainIdLogged, chainId, accountName]);

  useEffect(() => {
    let options = [
      {
        label: `All Collections (${ownedCollections.length})`,
        value: '',
      },
    ];

    ownedCollections.forEach((item) =>
      options.push({
        label: `(${item.collection.name}) By ${item.collection.author}`,
        value: item.collection.collection_name,
      })
    );

    setCollectionsFilterOptions(options);
  }, [ownedCollections]);

  useEffect(() => {
    async function getUserSales() {
      try {
        const { data: sales } = await getSalesService(chainKey, {
          owner: accountName,
          collection_name: selectedCollection,
        });

        setFilteredSales(sales.data);
      } catch (e) {
        modalRef.current?.openModal();
        const jsonError = JSON.parse(JSON.stringify(e));
        const details = JSON.stringify(e, undefined, 2);
        const message =
          jsonError?.cause?.json?.error?.details[0]?.message ??
          'Unable to get user sales';

        setModal({
          title: 'Error',
          message,
          details,
        });
      }
    }
    getUserSales();
  }, [selectedCollection, accountName, chainKey]);

  async function handleSeeMoreSales() {
    setIsLoading(true);

    try {
      const { data } = await getSalesService(chainKey, {
        owner: accountName,
        collection_name: selectedCollection,
        page: currentPage + 1,
        limit,
        offset,
      });

      setFilteredSales((state) => [...state, ...data.data]);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to get user sales';

      setModal({
        title: 'Error',
        message,
        details,
      });
    }

    setIsLoading(false);
  }

  async function onSubmit() {
    setIsLoading(true);

    let saleIds = [];
    selectedSales.map((sale) => {
      saleIds.push(sale.sale_id);
    });
    try {
      const actions = [];
      saleIds.map((id) => {
        const action = {
          account: 'atomicmarket',
          name: 'cancelsale',
          authorization: [
            {
              actor: ual.activeUser.accountName,
              permission: ual.activeUser.requestPermission,
            },
          ],
          data: {
            sale_id: id,
          },
        };
        actions.push(action);
      });

      await CancelSalesAssetService({
        activeUser: ual.activeUser,
        actions: actions,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Sales successfully canceled.';
      const message = 'Please wait while we refresh the page.';

      setModal({
        title,
        message,
      });

      setTimeout(() => {
        router.reload();
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to cancel the sale of selected NFTs';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  function handleSaleSelection(sale) {
    const alreadySelected =
      selectedSales.length > 0 &&
      selectedSales.some((item) => item.sale_id === sale.sale_id);
    if (!alreadySelected) {
      setSelectedSales((state) => [...state, ...[sale]]);
    } else {
      setSelectedSales((state) => {
        const saleIndex = state.findIndex(
          (item) => item && item.sale_id === sale.sale_id
        );
        let newState = state.filter((item, index) => index !== saleIndex);
        return [...newState];
      });
    }
  }

  function handleLogin() {
    ual?.showModal();
  }

  if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
    return (
      <>
        <Head>
          <title>{`Cancel Sales - ${appName}`}</title>
        </Head>

        <Header.Root border>
          <Header.Content title="Cancel Sales" />
        </Header.Root>

        <main className="container">
          <h2 className="headline-2 mt-4 md:mt-8">
            Cancel one or multiple sales
          </h2>
          <ol className="list-decimal pl-6 body-1 text-neutral-200 mt-2">
            <li className="pl-1">
              Select the sales by clicking on their pictures to the right.
            </li>
            <li className="pl-1">Each selected sale will be cancelled.</li>
            <li className="pl-1">Click the "Cancel Sales" button.</li>
          </ol>
          <Modal ref={modalRef} title={modal.title}>
            <p className="body-2 mt-2">{modal.message}</p>
            {!modal.isError ? (
              <span className="flex gap-2 items-center py-4 body-2 font-bold text-white">
                <CircleNotch size={24} weight="bold" className="animate-spin" />
                Loading...
              </span>
            ) : (
              <Disclosure>
                <Disclosure.Button className="btn btn-small mt-4">
                  Details
                </Disclosure.Button>
                <Disclosure.Panel>
                  <pre className="overflow-auto p-4 rounded-lg bg-neutral-700 max-h-96 mt-4">
                    {modal.details}
                  </pre>
                </Disclosure.Panel>
              </Disclosure>
            )}
          </Modal>

          <div className="flex md:flex-row flex-col gap-16 w-full md:my-16 my-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:w-1/2 w-full gap-8"
            >
              {selectedSales.length > 0 ? (
                <div className="flex flex-col gap-8">
                  <h3 className="headline-3">Selected Sales</h3>
                  <CardContainer style="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 sm:gap-8">
                    {selectedSales.map((sale, index) => (
                      <div key={index} className="w-full flex flex-col gap-4">
                        <Card
                          id={sale.sale_id}
                          onClick={() => handleSaleSelection(sale)}
                          image={
                            sale.assets[0].data['img']
                              ? `${ipfsEndpoint}/${sale.assets[0].data['img']}`
                              : sale.assets[0].data['image']
                              ? `${ipfsEndpoint}/${sale.assets[0].data['image']}`
                              : sale.assets[0].data['glbthumb']
                              ? `${ipfsEndpoint}/${sale.assets[0].data['glbthumb']}`
                              : ''
                          }
                          video={
                            sale.assets[0].data['video']
                              ? `${ipfsEndpoint}/${sale.assets[0].data['video']}`
                              : ''
                          }
                          title={sale.assets[0].name}
                          subtitle={`by ${sale.collection.author}`}
                          saleInfo={{
                            isBundle: true,
                            assetCount: sale.assets.length,
                            listingPrice: sale.listing_price,
                            token: sale.listing_symbol,
                            tokenPrecision: sale.price.token_precision,
                          }}
                          viewLink={getViewLink(sale)}
                        />
                      </div>
                    ))}
                  </CardContainer>
                </div>
              ) : (
                <div className="bg-neutral-800 px-8 py-16 text-center rounded-xl">
                  <h4 className="title-1">Select sales</h4>
                </div>
              )}
              {isLoading ? (
                <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
                  <CircleNotch
                    size={24}
                    weight="bold"
                    className="animate-spin"
                  />
                  Loading...
                </span>
              ) : (
                <button
                  type="submit"
                  className={`btn w-fit whitespace-nowrap ${
                    isSaved && 'animate-pulse bg-emerald-600'
                  }`}
                  disabled={selectedSales.length === 0}
                >
                  {isSaved ? 'Saved' : 'Cancel Sales'}
                </button>
              )}
            </form>
            <div className="flex flex-col md:w-1/2 w-full">
              <div className="flex flex-col gap-8">
                <h3 className="headline-3">Select sales</h3>

                {collectionsFilterOptions.length > 0 && (
                  <div className="z-10">
                    <Select
                      onChange={(option) => setSelectedCollection(option)}
                      label="Filter by collection"
                      selectedValue={collectionsFilterOptions[0].value}
                      options={collectionsFilterOptions}
                    />
                  </div>
                )}
                {filteredSales.length > 0 ? (
                  <CardContainer style="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 sm:gap-8">
                    {filteredSales.map((sale, index) => {
                      return (
                        <div key={index} className="w-full flex flex-col gap-4">
                          <div
                            className={`cursor-pointer ${
                              selectedSales.includes(sale) &&
                              'border-4 rounded-xl'
                            } relative`}
                          >
                            <Card
                              id={sale.sale_id}
                              onClick={() => handleSaleSelection(sale)}
                              image={
                                sale.assets[0].data['img']
                                  ? `${ipfsEndpoint}/${sale.assets[0].data['img']}`
                                  : sale.assets[0].data['image']
                                  ? `${ipfsEndpoint}/${sale.assets[0].data['image']}`
                                  : sale.assets[0].data['glbthumb']
                                  ? `${ipfsEndpoint}/${sale.assets[0].data['glbthumb']}`
                                  : ''
                              }
                              video={
                                sale.assets[0].data['video']
                                  ? `${ipfsEndpoint}/${sale.assets[0].data['video']}`
                                  : ''
                              }
                              title={sale.assets[0].name}
                              subtitle={`by ${sale.collection.author}`}
                              saleInfo={{
                                isBundle: true,
                                assetCount: sale.assets.length,
                                listingPrice: sale.listing_price,
                                token: sale.listing_symbol,
                                tokenPrecision: sale.price.token_precision,
                              }}
                              viewLink={getViewLink(sale)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContainer>
                ) : (
                  <>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                        <h4 className="title-1">No sales found</h4>
                      </div>
                    )}
                  </>
                )}
                {!isEndOfList && (
                  <div className="flex justify-center">
                    <SeeMoreButton
                      isLoading={isLoading}
                      onClick={handleSeeMoreSales}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Cancel Sales - ${appName}`}</title>
      </Head>

      {!ual?.activeUser && (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to cancel one or multiple sales
          </p>
          <button type="button" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
}

export default withUAL(CancelSales);
