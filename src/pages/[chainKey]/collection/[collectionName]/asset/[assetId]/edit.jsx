import { useState, useEffect, Fragment, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { Tab, Disclosure } from '@headlessui/react';
import { CircleNotch, ImageSquare, UploadSimple } from 'phosphor-react';

import { useForm, Controller } from 'react-hook-form';

import { ipfsEndpoint } from '@configs/globalsConfig';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getAssetService } from '@services/asset/getAssetService';
import { burnAssetService } from '@services/asset/burnAssetService';
import { getCollectionService } from '@services/collection/getCollectionService';
import { updateMutableDataService } from '@services/asset/updateMutableDataService';
import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';

import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Switch } from '@components/Switch';

function EditAsset({ ual, collection, asset, chainKey }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageSelection, setImageSelection] = useState(false);
  const [modal, setModal] = useState({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { ...asset.mutable_data },
  });

  const mutableDataList = asset.schema.format.filter(
    (attribute) => asset.template.immutable_data[attribute.name] === undefined
  );

  const assetImage = asset.data.img;
  const assetVideo = asset.data.video;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  function handleLogin() {
    ual?.showModal();
  }

  async function onSubmitMutableData(attributes) {
    setIsLoading(true);

    try {
      const mutableData = [];

      for (const key in attributes) {
        const attribute = attributes[key];

        const item = mutableDataList.find((item) => item.name === key);

        if (item && attribute) {
          if (item.type === 'image' && attribute.length > 0) {
            const pinataImage = await uploadImageToIpfsService(attribute[0]);

            mutableData.push({
              key: key,
              value: ['string', pinataImage ? pinataImage.IpfsHash : ''],
            });
          }

          if (item.type === 'bool') {
            mutableData.push({
              key: key,
              value: ['uint8', attribute ? 1 : 0],
            });
          }

          if (item.type === 'ipfs') {
            mutableData.push({
              key: key,
              value: ['string', attribute],
            });
          }

          if (item.type === 'double') {
            mutableData.push({
              key: key,
              value: ['float64', attribute],
            });
          }

          if (item.type === 'uint64') {
            mutableData.push({
              key: key,
              value: [item.type, attribute],
            });
          }

          if (item.type === 'string') {
            mutableData.push({
              key: key,
              value: [item.type, attribute],
            });
          }
        }
      }

      const data = {
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        asset_owner: asset.owner,
        asset_id: asset.asset_id,
        new_mutable_data: mutableData,
      };

      const hasChanged = !mutableData.every(
        (item) => asset.mutable_data[item.key] === item.value[1]
      );

      if (hasChanged) {
        await updateMutableDataService(data);

        setIsSaved(true);

        modalRef.current?.openModal();
        const title = 'NFT was successfully updated';
        const message = 'Please await while we redirect you.';

        setModal({
          title,
          message,
        });

        setTimeout(() => {
          router.push(
            `/${chainKey}/collection/${collection.collection_name}/asset/${asset.asset_id}`
          );
          setIsSaved(false);
        }, 3000);
      }
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to edit mutable data';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onBurnAsset() {
    setIsLoading(true);

    try {
      const data = {
        activeUser: ual.activeUser,
        asset_owner: asset.owner,
        asset_id: asset.asset_id,
      };

      await burnAssetService(data);

      setIsSaved(true);
      router.push(
        `/${chainKey}/collection/${collection.collection_name}/asset/${asset.asset_id}`
      );
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to burn asset';

      setError({
        message,
        details,
      });
    }
    setIsLoading(false);
  }

  if (hasAuthorization) {
    return (
      <>
        <header className="-mt-14 overflow-hidden -z-10">
          <div className="container flex items-center">
            <div className="flex-1">
              <div>
                <h2 className="headline-2 block mb-2">Edit Asset</h2>
                <p className="headline-2 mb-2">#{asset.asset_id}</p>
              </div>
              <h1 className="headline-1">{asset.name}</h1>
            </div>
            <div className="flex-1 flex justify-center py-32">
              <div className="relative max-w-sm w-full aspect-square drop-shadow-lg">
                <>
                  {assetImage && (
                    <>
                      <Image
                        alt={asset.name}
                        src={`${ipfsEndpoint}/${assetImage}`}
                        layout="fill"
                        objectFit="contain"
                      />
                      <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                        <Image
                          alt={asset.name}
                          src={`${ipfsEndpoint}/${assetImage}`}
                          layout="fill"
                          objectFit="fill"
                          quality={1}
                        />
                      </div>
                    </>
                  )}
                  {assetVideo && (
                    <>
                      <video
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source
                          src={`${ipfsEndpoint}/${assetVideo}`}
                          type="video/mp4"
                        />
                      </video>
                      <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                        <video
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source
                            src={`${ipfsEndpoint}/${assetVideo}`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </>
                  )}
                  {!assetImage && !assetVideo && (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <ImageSquare size={64} />
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        </header>

        <Modal ref={modalRef} title={modal.title}>
          <p className="body-2 mt-2">{modal.message}</p>
          {!modal.isError ? (
            <span className="flex gap-2 items-center py-4 body-2 font-bold text-white">
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              Redirecting...
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

        <Tab.Group>
          <Tab.List className="tab-list -mt-14 mb-14">
            <Tab className="tab">Mutable data</Tab>
            <Tab className="tab">Burn asset</Tab>
          </Tab.List>
          <Tab.Panels className="container">
            <Tab.Panel>
              <form
                onSubmit={handleSubmit(onSubmitMutableData)}
                className="flex flex-col gap-8 w-full md:items-start items-center"
              >
                <h3 className="headline-3 block">Mutable attributes</h3>
                <div className="grid grid-flow-row auto-rows-max md:gap-4 gap-8 w-full">
                  {mutableDataList &&
                    mutableDataList.map((item, index) => (
                      <div key={index}>
                        {item.type === 'image' || item.type === 'bool' ? (
                          <>
                            {item.type === 'image' && (
                              <div className="flex md:flex-row flex-col gap-4">
                                <div className="p-4 flex items-center justify-center border border-neutral-700 rounded">
                                  <span className="md:w-56 w-full text-center body-2 uppercase whitespace-nowrap">
                                    {item.name}
                                  </span>
                                </div>
                                <label
                                  htmlFor="file"
                                  className="flex w-full p-4 items-start rounded bg-neutral-800 border focus-within:border-white focus-within:bg-neutral-700 border-neutral-700"
                                >
                                  <>
                                    {asset.mutable_data[item.name] &&
                                      !imageSelection && (
                                        <div className="flex w-full justify-between">
                                          <span>
                                            {asset.mutable_data[item.name]}
                                          </span>
                                          <UploadSimple size={24} />
                                        </div>
                                      )}
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={({ field }) => (
                                        <>
                                          <input
                                            id="file"
                                            type="file"
                                            accept="image/*"
                                            className={
                                              asset.mutable_data[item.name] &&
                                              !imageSelection
                                                ? 'hidden'
                                                : null
                                            }
                                            onChange={(event) => {
                                              console.log(event);
                                              field.onChange(
                                                event.target.files
                                              );
                                              setImageSelection(true);
                                            }}
                                          />
                                        </>
                                      )}
                                    />
                                  </>
                                </label>
                              </div>
                            )}
                            {item.type === 'bool' && (
                              <div className="flex md:flex-row flex-col items-center gap-4">
                                <div className="p-4 border flex items-center justify-center border-neutral-700 rounded">
                                  <span className="w-full md:w-56 text-center body-2 uppercase whitespace-nowrap">
                                    {item.name}
                                  </span>
                                </div>
                                <Controller
                                  control={control}
                                  name={item.name}
                                  defaultValue={Boolean(
                                    asset.mutable_data[item.name]
                                  )}
                                  render={({ field }) => (
                                    <Switch
                                      onChange={field.onChange}
                                      checked={Boolean(field.value)}
                                      label={
                                        field.value ? 'Enabled' : 'Disabled'
                                      }
                                    />
                                  )}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex md:flex-row flex-col gap-4">
                            <div className="p-4 border flex items-center justify-center border-neutral-700 rounded">
                              <span className="w-full md:w-56 text-center body-2 uppercase whitespace-nowrap">
                                {item.name}
                              </span>
                            </div>
                            <Input
                              {...register(item.name)}
                              error={errors[item.name]?.message}
                              type="text"
                              placeholder={
                                item.type === 'string' ? 'text' : item.type
                              }
                              defaultValue={asset.mutable_data[item.name]}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>

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
                  >
                    {isSaved ? 'Saved' : 'Update mutable data'}
                  </button>
                )}
              </form>
            </Tab.Panel>
            <Tab.Panel>
              <div className="container mx-auto flex flex-col text-center items-center gap-8">
                <span className="body-1 text-amber-400">
                  Note: Burning an asset does not decrement the issued supply of
                  the parent template.
                </span>
                <button className="btn w-fit" onClick={onBurnAsset}>
                  Burn asset
                </button>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </>
    );
  }

  return (
    <>
      {!ual?.activeUser ? (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to edit an asset.
          </p>
          <button type="text" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-8 py-24 text-center">
          <h4 className="headline-3">
            You don't have authorization to edit this asset.
          </h4>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName, assetId } = params;

  const [{ data: collection }, { data: asset }] = await Promise.all([
    getCollectionService(chainKey, { collectionName }),
    getAssetService(chainKey, { collectionName, assetId }),
  ]);

  return {
    props: {
      chainKey,
      collection: collection.data,
      asset: asset.data,
    },
  };
}

export default withUAL(EditAsset);
