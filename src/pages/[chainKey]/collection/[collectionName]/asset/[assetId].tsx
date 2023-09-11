import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import Head from 'next/head';
import { withUAL } from 'ual-reactjs-renderer';
import { GetServerSideProps } from 'next';

import { ipfsEndpoint, appName } from '@configs/globalsConfig';

import { getAssetService, AssetProps } from '@services/asset/getAssetService';

import { Card } from '@components/Card';
import { Header } from '@components/Header';
import { Attributes } from '@components/Attributes';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';
import { collectionTabs } from '@utils/collectionTabs';
import { handlePreview } from '@utils/handlePreview';

interface AssetViewProps {
  ual: any;
  chainKey: string;
  asset: AssetProps;
}

function Asset({ ual, chainKey, asset }: AssetViewProps) {
  const collection = asset.collection;
  const [images, setImages] = useState([]);

  useEffect(() => {
    handlePreview(asset, setImages);
  }, [asset]);

  const hasAuthorization = isAuthorizedAccount(ual, collection) as boolean;

  return (
    <>
      <Head>
        <title>{`NFT #${asset.asset_id} - ${appName}`}</title>
      </Head>

      <Header.Root
        breadcrumb={[
          [
            hasAuthorization ? 'My Collections' : 'Explorer',
            hasAuthorization ? `/${chainKey}` : `/${chainKey}/explorer`,
          ],
          [
            collection.collection_name,
            `/${chainKey}/collection/${collection.collection_name}`,
          ],
          [
            collectionTabs[3].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[3].key}`,
          ],
          [asset.name],
        ]}
      >
        <Header.Content title={asset.name} subtitle={`NFT #${asset.asset_id}`}>
          {hasAuthorization && !asset.burned_by_account && (
            <Link
              href={`/${chainKey}/collection/${collection.collection_name}/asset/${asset.asset_id}/edit`}
              className="btn mt-4"
            >
              Update NFT
            </Link>
          )}
        </Header.Content>
        <Header.Banner images={images} />
      </Header.Root>

      <Tab.Group>
        <Tab.List className="tab-list mb-4 md:mb-8">
          <Tab className="tab">Information</Tab>
          <Tab className="tab">Immutable data</Tab>
          {Object.keys(asset.mutable_data).length > 0 && (
            <Tab className="tab">Mutable data</Tab>
          )}
        </Tab.List>
        <Tab.Panels className="container">
          <Tab.Panel>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-0 justify-center pb-8">
              <div className="grid grid-cols-1 h-fit">
                <Card
                  href={`/${chainKey}/collection/${collection.collection_name}`}
                  image={
                    collection.img ? `${ipfsEndpoint}/${collection.img}` : ''
                  }
                  title={collection.name}
                  subtitle={`by ${collection.author}`}
                />
              </div>
              <div className="md:w-1/2 w-full">
                <div className="w-full md:max-w-sm mx-auto">
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Owner</span>
                    <span className="font-bold">{asset.owner}</span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Mint Number</span>
                    <div>
                      <span className="font-bold pr-2">
                        {Number(asset.template_mint) > 0
                          ? asset.template_mint
                          : 'Minting...'}
                      </span>
                      {asset.template && (
                        <span className="">
                          (max:{' '}
                          {parseInt(asset.template.max_supply, 10) ||
                            'Infinite'}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                  {asset.template && (
                    <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                      <span>Template ID</span>
                      <Link
                        href={`/${chainKey}/collection/${collection.collection_name}/template/${asset.template.template_id}`}
                        className="font-bold underline"
                      >
                        {asset.template.template_id}
                      </Link>
                    </div>
                  )}
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Schema</span>
                    <Link
                      href={`/${chainKey}/collection/${collection.collection_name}/schema/${asset.schema.schema_name}`}
                      className="font-bold underline"
                    >
                      {asset.schema.schema_name}
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Burnable</span>
                    <span className="font-bold">
                      {asset.is_burnable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Transferable</span>
                    <span className="font-bold">
                      {asset.is_transferable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <Attributes.List>
              {asset.schema.format.map((schema) => (
                <Attributes.Item
                  key={schema.name}
                  name={schema.name}
                  type={schema.type}
                  value={
                    asset.template
                      ? asset.template.immutable_data[schema.name]
                      : asset.immutable_data[schema.name]
                  }
                />
              ))}
            </Attributes.List>
          </Tab.Panel>
          {Object.keys(asset.mutable_data).length > 0 && (
            <Tab.Panel>
              <Attributes.List>
                {asset.schema.format.map((schema) => (
                  <Attributes.Item
                    key={schema.name}
                    name={schema.name}
                    type={schema.type}
                    value={asset.mutable_data[schema.name]}
                  />
                ))}
              </Attributes.List>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const assetId = params.assetId as string;

  try {
    const { data: asset } = await getAssetService(chainKey, { assetId });

    return {
      props: {
        asset: asset.data,
        chainKey,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Asset);
