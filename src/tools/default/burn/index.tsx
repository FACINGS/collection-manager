import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircleNotch, MagnifyingGlass } from '@phosphor-icons/react';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';

import { useForm } from 'react-hook-form';

import { Card } from '@components/Card';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Select } from '@components/Select';
import { Loading } from '@components/Loading';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { Header } from '@components/Header';

import chainsConfig from '@configs/chainsConfig';
import { ipfsEndpoint, chainKeyDefault, appName } from '@configs/globalsConfig';

import { burnMultipleAssetService } from '@services/asset/burnAssetService';
import {
  getInventoryService,
  AssetProps,
} from '@services/inventory/getInventoryService';
import { getAccountStatsService } from '@services/account/getAccountStatsService';

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

function Burn({ ual }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { handleSubmit } = useForm({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<AssetProps[]>([]);
  const [ownedCollections, setOwnedCollections] = useState([]);
  const [collectionsFilterOptions, setCollectionsFilterOptions] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [match, setMatch] = useState('');
  const [waitToSearch, setWaitToSearch] = useState(null);
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
  const currentPage = Math.ceil(filteredAssets.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = filteredAssets.length % limit > 0;

  const accountName = ual?.activeUser?.accountName;

  const getViewLink = (asset) => {
    if (chainKey == 'xpr') {
      return `https://soon.market/nft/templates/${asset.template.template_id}/${asset.asset_id}?utm_medium=burn-nfts-card&utm_source=nft-manager`;
    }
    return `/${chainKey}/collection/${asset.collection.collection_name}/asset/${asset.asset_id}`;
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data: inventory } = await getInventoryService(chainKey, {
          owner: accountName,
        });

        const { data: collections } = await getAccountStatsService(
          chainKey,
          accountName
        );

        setFilteredAssets(inventory.data);
        setOwnedCollections(collections.data['collections']);
      } catch (e) {
        modalRef.current?.openModal();
        const jsonError = JSON.parse(JSON.stringify(e));
        const details = JSON.stringify(e, undefined, 2);
        const message =
          jsonError?.cause?.json?.error?.details[0]?.message ??
          'Unable to get user inventory or collections';

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
    async function getUserInventory() {
      try {
        const { data: inventory } = await getInventoryService(chainKey, {
          owner: accountName,
          collection_name: selectedCollection,
        });

        setFilteredAssets(inventory.data);
      } catch (e) {
        modalRef.current?.openModal();
        const jsonError = JSON.parse(JSON.stringify(e));
        const details = JSON.stringify(e, undefined, 2);
        const message =
          jsonError?.cause?.json?.error?.details[0]?.message ??
          'Unable to get user inventory';

        setModal({
          title: 'Error',
          message,
          details,
        });
      }
    }
    getUserInventory();
  }, [selectedCollection, accountName, chainKey]);

  async function handleSeeMoreAssets() {
    setIsLoading(true);

    try {
      const { data } = await getInventoryService(chainKey, {
        owner: accountName,
        match,
        collection_name: selectedCollection,
        page: currentPage + 1,
        limit,
        offset,
      });

      setFilteredAssets((state) => [...state, ...data.data]);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to get user inventory';

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

    let assetIds = [];
    selectedAssets.map((item) => {
      assetIds.push(item.asset_id);
    });
    try {
      const actions = [];

      assetIds.map((assetId) => {
        const action = {
          account: 'atomicassets',
          name: 'burnasset',
          authorization: [
            {
              actor: ual.activeUser.accountName,
              permission: ual.activeUser.requestPermission,
            },
          ],
          data: {
            asset_owner: ual.activeUser.accountName,
            asset_id: assetId,
          },
        };

        actions.push(action);
      });

      await burnMultipleAssetService({
        activeUser: ual.activeUser,
        actions: actions,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'NFTs was successfully burned';
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
        'Unable to burn NFTs';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  function handleAssetSelection(asset) {
    const alreadySelected =
      selectedAssets.length > 0 &&
      selectedAssets.find((item) => item && item.asset_id === asset.asset_id);

    if (!alreadySelected) {
      setSelectedAssets((state) => [...state, ...[asset]]);
    }

    setSelectedAssets((state) => {
      const assetIndex = selectedAssets.findIndex(
        (item) => item && item.asset_id === asset.asset_id
      );

      let newState = state.filter((item, index) => index !== assetIndex);

      return [...newState];
    });
  }

  function handleLogin() {
    ual?.showModal();
  }

  async function handleSearch(event) {
    const { value } = event.target;
    clearTimeout(waitToSearch);

    setMatch(value);
    const newWaitToSearch = setTimeout(async () => {
      const { data: assets } = await getInventoryService(chainKey, {
        match: value || '',
        owner: accountName,
        collection_name: selectedCollection || '',
      });

      setFilteredAssets(assets.data);
    }, 500);

    setWaitToSearch(newWaitToSearch);
  }

  if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
    return (
      <>
        <Head>
          <title>{`Burn NFTs - ${appName}`}</title>
        </Head>

        <Header.Root border>
          <Header.Content title="Burn NFTs" />
        </Header.Root>

        <main className="container">
          <h2 className="headline-2 mt-4 md:mt-8">Burn one or multiple NFTs</h2>
          <ol className="list-decimal pl-6 body-1 text-neutral-200 mt-2">
            <li className="pl-1">
              Select the NFTs by clicking on their pictures.
            </li>
            <li className="pl-1">Click the "Burn NFT(s)" button.</li>
          </ol>
          <br />
          <p>Note:</p>
          <ol className="list-disc pl-6 body-1 text-neutral-200 mt-2">
            <li className="pl-1">Each selected NFT will be burned.</li>
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
              {selectedAssets.length > 0 ? (
                <div className="flex flex-col gap-8">
                  <h3 className="headline-3">Selected NFTs</h3>
                  <CardContainer style="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 sm:gap-8">
                    {selectedAssets.map((asset, index) => (
                      <div key={index} className="w-full flex flex-col gap-4">
                        <Card
                          id={asset.template_mint}
                          onClick={() => handleAssetSelection(asset)}
                          image={
                            asset.data['img']
                              ? `${ipfsEndpoint}/${asset.data['img']}`
                              : asset.data['image']
                              ? `${ipfsEndpoint}/${asset.data['image']}`
                              : asset.data['glbthumb']
                              ? `${ipfsEndpoint}/${asset.data['glbthumb']}`
                              : ''
                          }
                          video={
                            asset.data['video']
                              ? `${ipfsEndpoint}/${asset.data['video']}`
                              : ''
                          }
                          title={asset.name}
                          subtitle={`by ${asset.collection.author}`}
                          viewLink={getViewLink(asset)}
                        />
                      </div>
                    ))}
                  </CardContainer>
                </div>
              ) : (
                <div className="bg-neutral-800 px-8 py-16 text-center rounded-xl">
                  <h4 className="title-1">Select NFTs to burn</h4>
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
                  disabled={selectedAssets.length === 0}
                >
                  {isSaved
                    ? 'Saved'
                    : `Burn NFT${selectedAssets.length > 1 ? 's' : ''}`}
                </button>
              )}
            </form>
            <div className="flex flex-col md:w-1/2 w-full">
              <div className="flex flex-col gap-8">
                <h3 className="headline-3">Select NFTs to burn</h3>

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
                <Input
                  icon={<MagnifyingGlass size={24} />}
                  type="search"
                  label="Search by name"
                  placeholder="Search NFT"
                  onChange={handleSearch}
                  value={match}
                />
                {filteredAssets.length > 0 ? (
                  <CardContainer style="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 sm:gap-8">
                    {filteredAssets.map((asset, index) => {
                      if (asset.is_burnable) {
                        return (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-4"
                          >
                            <div
                              className={`cursor-pointer ${
                                selectedAssets.includes(asset) &&
                                'border-4 rounded-xl'
                              }`}
                            >
                              <Card
                                id={asset.template_mint}
                                onClick={() => handleAssetSelection(asset)}
                                image={
                                  asset.data.image
                                    ? `${ipfsEndpoint}/${asset.data.image}`
                                    : asset.data.img
                                    ? `${ipfsEndpoint}/${asset.data.img}`
                                    : asset.data.glbthumb
                                    ? `${ipfsEndpoint}/${asset.data.glbthumb}`
                                    : ''
                                }
                                video={
                                  asset.data.video
                                    ? `${ipfsEndpoint}/${asset.data.video}`
                                    : ''
                                }
                                title={asset.name}
                                subtitle={`by ${asset.collection.author}`}
                                viewLink={getViewLink(asset)}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  </CardContainer>
                ) : (
                  <>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                        <h4 className="title-1">NFTs not found</h4>
                      </div>
                    )}
                  </>
                )}
                {!isEndOfList && (
                  <div className="flex justify-center">
                    <SeeMoreButton
                      isLoading={isLoading}
                      onClick={handleSeeMoreAssets}
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
        <title>{`Burn NFTs - ${appName}`}</title>
      </Head>

      {!ual?.activeUser && (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to burn one or multiple NFTs
          </p>
          <button type="button" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
}

export default withUAL(Burn);
