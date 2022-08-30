import { useRouter } from 'next/router';

import { getCollectionService } from '@services/collection/getCollectionService';
import { listCollectionsService } from '@services/collection/listCollectionsService';
import { collectionStatsService } from '@services/collection/collectionStatsService';
import { collectionAssetsService } from '@services/collection/collectionAssetsService';
import { collectionSchemasService } from '@services/collection/collectionSchemasService';
import { collectionAccountsService } from '@services/collection/collectionAccountsService';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';

import { CollectionTemplatesList } from '@components/collection/CollectionTemplatesList';
import { CollectionAccountsList } from '@components/collection/CollectionAccountsList';
import { CollectionSchemasList } from '@components/collection/CollectionSchemasList';
import { CollectionAssetsList } from '@components/collection/CollectionAssetsList';
import { CollectionStats } from '@components/collection/CollectionStats';
import { Loading } from '@components/Loading';
import { Tabs } from '@components/Tabs';

import Image from 'next/image';
import Link from 'next/link';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { ArrowLeftIcon } from '@components/icons/ArrowLeftIcon';
import { NoImageIcon } from '@components/icons/NoImageIcon';

export default function Collection({
  collection,
  stats,
  templates,
  assets,
  schemas,
  accounts,
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }

  function handleTimestamp() {
    const date = new Date(Number(collection.created_at_time));
    return date.toLocaleString();
  }

  const tabs = ['Stats', 'Templates', "NFT's", 'Schemas', 'Accounts'];

  function handleTabContent(tab) {
    switch (tab) {
      case 'Stats':
        return <CollectionStats {...stats} />;
        break;

      case 'Templates':
        return (
          <CollectionTemplatesList
            templates={templates}
            collection={collection.collection_name}
            totalTemplates={stats.templates}
          />
        );
        break;

      case `NFT's`:
        return (
          <CollectionAssetsList
            assets={assets}
            collection={collection.collection_name}
            totalAssets={stats.assets}
          />
        );
        break;

      case `Schemas`:
        return (
          <CollectionSchemasList
            schemas={schemas}
            collection={collection.collection_name}
            totalSchemas={stats.schemas}
          />
        );
        break;

      case `Accounts`:
        return (
          <CollectionAccountsList
            accounts={accounts}
            collection={collection.collection_name}
          />
        );
        break;

      default:
        break;
    }
  }

  return (
    <div className="py-20 flex flex-row container mx-auto justify-center relative">
      <div
        className="absolute left-0 top-4 p-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon width="32" height="32" />
      </div>
      <div className="flex flex-col lg:flex-row items-center md:items-start">
        <div className="flex flex-col items-center m-4 w-fit h-fit">
          <div className="bg-primary w-full flex justify-center rounded-t-lg overflow-hidden">
            {collection.img ? (
              <Image
                alt={collection.name}
                src={`${ipfsEndpoint}/${collection.img}`}
                width="320"
                height="320"
                objectFit="contain"
              />
            ) : (
              <div className="w-full h-full items-center flex justify-center pt-[100%] relative">
                <div className="absolute top-0 left-0 translate-x-[50%] translate-y-[50%]">
                  <NoImageIcon />
                </div>
              </div>
            )}
          </div>
          <div
            className={`w-auto max-w-prose h-fit shadow-lg p-8 min-w-[20rem] rounded-b-lg flex flex-col bg-primary ${
              collection.data.description ? 'gap-4' : null
            }`}
          >
            <div className="flex flex-col gap-2 text-white">
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              <div className="flex gap-2 items-center">
                <p className="text-sm">Author:</p>
                <Link href={`author/${collection.author}`}>
                  <a className="text-sm font-bold whitespace-nowrap cursor-pointer underline">
                    {collection.author}
                  </a>
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm">URL:</p>
                <a
                  href={collection.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-solid text-sm font-bold whitespace-nowrap"
                >
                  {collection.data.name}
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm">Created:</p>
                <p className="text-sm font-bold whitespace-nowrap">
                  {handleTimestamp()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-8 m-4 bg-white  w-auto md:w-fit shadow-lg rounded-lg gap-8 min-w-[20rem]">
          <div className="flex flex-col gap-2 max-w-screen-md">
            <h1 className="text-4xl font-bold">{collection.name}</h1>
            <p className="text-sm">{collection.data.description}</p>
          </div>

          <Tabs tabs={tabs}>
            {({ selectedTab }) => (
              <>
                {tabs.map((item, index) => (
                  <div
                    key={index}
                    style={{ display: selectedTab === item ? 'block' : 'none' }}
                  >
                    {handleTabContent(item)}
                  </div>
                ))}
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await listCollectionsService({});

  const paths = data.data.map((collection) => {
    return { params: { collectionName: collection.collection_name } };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { collectionName } = context.params;

  const { data: collection } = await getCollectionService(collectionName);
  const { data: stats } = await collectionStatsService(collectionName);
  const { data: templates } = await collectionTemplatesService({
    collection: collectionName,
  });
  const { data: assets } = await collectionAssetsService({
    collection: collectionName,
  });
  const { data: schemas } = await collectionSchemasService({
    collection: collectionName,
  });
  const { data: accounts } = await collectionAccountsService({
    collection: collectionName,
  });

  return {
    props: {
      collection: collection.data,
      stats: stats.data,
      templates: templates.data,
      assets: assets.data,
      schemas: schemas.data,
      accounts: accounts.data,
    },
  };
}
