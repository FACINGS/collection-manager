import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { ImageSquare } from 'phosphor-react';
import Link from 'next/link';
import { withUAL } from 'ual-reactjs-renderer';

import { ipfsEndpoint } from '@configs/globalsConfig';

import { Card } from '@components/Card';

import { getAssetService } from '@services/asset/getAssetService';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

function Asset({ ual, chainKey, asset }) {
  const image = asset.data.img;
  const video = asset.data.video;
  const collection = asset.collection;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  function isBoolean(attribute) {
    const data = asset.schema.format.filter(
      (schema) => schema.name === attribute
    )[0];
    return data.type === 'bool';
  }

  return (
    <>
      <header className="-mt-14 overflow-hidden -z-10">
        <div className="container flex items-center">
          <div className="flex-1">
            <p className="headline-3 mb-2">ID #{asset.asset_id}</p>
            <h1 className="headline-1">{asset.name}</h1>
            <div className="flex gap-4 mt-8">
              {hasAuthorization && !asset.burned_by_account && (
                <Link
                  href={`/${chainKey}/collection/${collection.collection_name}/asset/${asset.asset_id}/edit`}
                >
                  <a className="btn">Edit NFT</a>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center py-32">
            <div className="relative max-w-sm w-full aspect-square drop-shadow-lg">
              <>
                {image && (
                  <>
                    <Image
                      alt={asset.name}
                      src={`${ipfsEndpoint}/${image}`}
                      layout="fill"
                      objectFit="contain"
                    />
                    <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                      <Image
                        alt={asset.name}
                        src={`${ipfsEndpoint}/${image}`}
                        layout="fill"
                        objectFit="fill"
                        quality={1}
                      />
                    </div>
                  </>
                )}
                {video && (
                  <>
                    <video
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source
                        src={`${ipfsEndpoint}/${video}`}
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
                          src={`${ipfsEndpoint}/${video}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </>
                )}
                {!video && !image && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <ImageSquare size={64} />
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </header>
      <Tab.Group>
        <Tab.List className="tab-list -mt-14 mb-14">
          <Tab className="tab">Information</Tab>
          <Tab className="tab">Immutable data</Tab>
          {Object.keys(asset.mutable_data).length > 0 && (
            <Tab className="tab">Mutable data</Tab>
          )}
        </Tab.List>
        <Tab.Panels className="container">
          <Tab.Panel>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-0 justify-center">
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
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Owner</span>
                    <span className="font-bold">{asset.owner}</span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Mint Number</span>
                    <div>
                      <span className="font-bold pr-2">
                        {asset.template_mint !== '0'
                          ? asset.template_mint
                          : 'Minting...'}
                      </span>
                      <span className="">
                        (max:{' '}
                        {parseInt(asset.template.max_supply, 10) || 'Infinite'})
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Template ID</span>
                    <Link
                      href={`/${chainKey}/collection/${collection.collection_name}/template/${asset.template.template_id}`}
                    >
                      <a className="font-bold underline">
                        {asset.template.template_id}
                      </a>
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Schema Name</span>
                    <Link
                      href={`/${chainKey}/collection/${collection.collection_name}/schema/${asset.schema.schema_name}`}
                    >
                      <a className="font-bold underline">
                        {asset.schema.schema_name}
                      </a>
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Burnable</span>
                    <span className="font-bold">
                      {asset.is_burnable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
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
            <div className="w-full px-4 mx-auto">
              {Object.entries(asset.template.immutable_data).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 body-2 gap-8 text-white border-b border-neutral-700"
                  >
                    <span>{label}</span>
                    <span className="font-bold break-all">{value}</span>
                  </div>
                )
              )}
            </div>
          </Tab.Panel>
          {Object.keys(asset.mutable_data).length > 0 && (
            <Tab.Panel>
              <div className="w-full px-4 mx-auto">
                {Object.entries(asset.mutable_data).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 body-2 gap-8 text-white border-b border-neutral-700"
                  >
                    <span>{label}</span>
                    <span className="font-bold break-all">
                      {isBoolean(label) ? `${Boolean(value)}` : value}
                    </span>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, assetId } = params;

  const { data: asset } = await getAssetService(chainKey, { assetId });

  return {
    props: {
      asset: asset.data,
      chainKey,
    },
  };
}

export default withUAL(Asset);
