import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { Tab, Disclosure } from '@headlessui/react';
import { CircleNotch } from 'phosphor-react';
import Head from 'next/head';

import { useForm, Controller } from 'react-hook-form';

import { getAssetService, AssetProps } from '@services/asset/getAssetService';
import { burnAssetService } from '@services/asset/burnAssetService';
import { updateMutableDataService } from '@services/asset/updateMutableDataService';
import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';

import { collectionTabs } from '@utils/collectionTabs';

import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Switch } from '@components/Switch';
import { Header } from '@components/Header';
import { InputPreview } from '@components/InputPreview';

import { appName } from '@configs/globalsConfig';
import { usePermission } from '@hooks/usePermission';
import { handlePreview } from '@utils/handlePreview';

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

interface EditAssetProps {
  ual: any;
  collection: CollectionProps;
  asset: AssetProps;
  chainKey: string;
}

interface MutableDataProps {
  key: string;
  value: any[];
}

interface AttributesProps {
  [key: string]: any;
}

function EditAsset({ ual, collection, asset, chainKey }: EditAssetProps) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { PermissionDenied } = usePermission({
    loggedAccountName: ual?.activeUser?.accountName,
    collectionAuthor: collection.author,
    collectionAuthorizedAccounts: collection.authorized_accounts,
  });

  const [images, setImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  useEffect(() => {
    handlePreview(asset, setImages);
  }, [asset]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  async function onSubmitMutableData(data) {
    setIsLoading(true);

    const attributes: AttributesProps[] = data;

    try {
      const mutableData: MutableDataProps[] = [];

      for (const key in attributes) {
        const attribute = attributes[key];

        const item = mutableDataList.find((item) => item.name === key);

        if (item && attribute) {
          if (
            item.type === 'image' ||
            (item.type === 'ipfs' && attribute.length > 0)
          ) {
            if (typeof attribute === 'string') {
              mutableData.push({
                key: key,
                value: ['string', attribute],
              });
            } else {
              const pinataImage = await uploadImageToIpfsService(attribute[0]);

              mutableData.push({
                key: key,
                value: ['string', pinataImage ? pinataImage['IpfsHash'] : ''],
              });
            }
          }

          if (item.type === 'bool') {
            mutableData.push({
              key: key,
              value: ['uint8', attribute ? 1 : 0],
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

      await updateMutableDataService({
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        asset_owner: asset.owner,
        asset_id: asset.asset_id,
        new_mutable_data: mutableData,
      });

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
      await burnAssetService({
        activeUser: ual.activeUser,
        asset_owner: asset.owner,
        asset_id: asset.asset_id,
      });

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
        'Unable to burn NFT';

      setModal({
        title: 'Error',
        message,
        details,
      });
    }
    setIsLoading(false);
  }

  if (PermissionDenied) {
    return <PermissionDenied />;
  }

  return (
    <>
      <Head>
        <title>{`Update NFT #${asset.asset_id} - ${appName}`}</title>
      </Head>

      <Header.Root
        breadcrumb={[
          ['My Collections', `/${chainKey}`],
          [
            collection.collection_name,
            `/${chainKey}/collection/${collection.collection_name}`,
          ],
          [
            collectionTabs[3].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[3].key}`,
          ],
          [
            asset.name,
            `/${chainKey}/collection/${collection.collection_name}/asset/${asset.asset_id}`,
          ],
          ['Update'],
        ]}
      >
        <Header.Content title={asset.name} />
        <Header.Banner images={images} />
      </Header.Root>

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
        <Tab.List className="tab-list mb-4 md:mb-8">
          <Tab className="tab">Mutable data</Tab>
          {asset.is_burnable && <Tab className="tab">Burn NFT</Tab>}
        </Tab.List>
        <Tab.Panels className="container">
          <Tab.Panel>
            <form
              onSubmit={handleSubmit(onSubmitMutableData)}
              className="flex flex-col gap-8 w-full md:items-start items-center"
            >
              <h3 className="headline-3 block">Mutable attributes</h3>
              <div className="grid grid-flow-row auto-rows-max md:gap-4 gap-8 w-full max-w-3xl">
                {mutableDataList &&
                  mutableDataList.map((item, index) => (
                    <div key={index}>
                      {item.type === 'image' ||
                      item.type === 'bool' ||
                      item.type === 'ipfs' ? (
                        <>
                          {item.type === 'image' && (
                            <div className="flex md:flex-row flex-col gap-4">
                              <div className="p-4 flex items-center justify-center border border-neutral-700 rounded">
                                <span className="md:w-56 w-full text-center body-2 uppercase whitespace-nowrap">
                                  {item.name}
                                </span>
                              </div>
                              <InputPreview
                                {...register(item.name)}
                                title="Add Image"
                                accept="image/*"
                                ipfsHash={asset.mutable_data[item.name]}
                              />
                            </div>
                          )}
                          {item.type === 'ipfs' && (
                            <div className="flex md:flex-row flex-col gap-4">
                              <div className="p-4 flex items-center justify-center border border-neutral-700 rounded">
                                <span className="md:w-56 w-full text-center body-2 uppercase whitespace-nowrap">
                                  {item.name}
                                </span>
                              </div>
                              <InputPreview
                                {...register(item.name)}
                                title="Add Image"
                                ipfsHash={asset.mutable_data[item.name]}
                              />
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
                                    label={field.value ? 'Enabled' : 'Disabled'}
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
          {asset.is_burnable && (
            <Tab.Panel>
              <div className="container mx-auto flex flex-col text-center items-center gap-8">
                <span className="body-1 text-amber-400">
                  Note: Burning an NFT does not decrement the issued supply of
                  the parent template.
                </span>
                <button className="btn w-fit" onClick={onBurnAsset}>
                  Burn NFT
                </button>
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;
  const assetId = params.assetId as string;

  const [{ data: collection }, { data: asset }] = await Promise.all([
    getCollectionService(chainKey, { collectionName }),
    getAssetService(chainKey, { assetId }),
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
