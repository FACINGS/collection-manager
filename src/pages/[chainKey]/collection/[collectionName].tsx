import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { GetServerSideProps } from 'next';

import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';
import {
  collectionStatsService,
  StatsProps,
} from '@services/collection/collectionStatsService';
import {
  collectionAssetsService,
  AssetProps,
} from '@services/collection/collectionAssetsService';
import {
  collectionSchemasService,
  SchemaProps,
} from '@services/collection/collectionSchemasService';
import {
  collectionAccountsService,
  AccountProps,
} from '@services/collection/collectionAccountsService';
import {
  collectionTemplatesService,
  TemplateProps,
} from '@services/collection/collectionTemplatesService';

import { CollectionTemplatesList } from '@components/collection/CollectionTemplatesList';
import { CollectionAccountsList } from '@components/collection/CollectionAccountsList';
import { CollectionSchemasList } from '@components/collection/CollectionSchemasList';
import { CollectionAssetsList } from '@components/collection/CollectionAssetsList';
import { CollectionPlugins } from '@components/collection/CollectionPlugins';
import { CollectionStats } from '@components/collection/CollectionStats';
import { CollectionHints } from '@components/collection/CollectionHints';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';
import { collectionTabs } from '@utils/collectionTabs';
import { Header } from '@components/Header';

import { appName } from '@configs/globalsConfig';
interface CollectionPageProps {
  ual: any;
  chainKey: string;
  collection: CollectionProps;
  stats: StatsProps;
  templates: TemplateProps[];
  assets: AssetProps[];
  burnedAssets: AssetProps[];
  schemas: SchemaProps[];
  accounts: AccountProps[];
}

function Collection({
  ual,
  chainKey,
  collection,
  stats,
  templates,
  assets,
  burnedAssets,
  schemas,
  accounts,
}: CollectionPageProps) {
  const router = useRouter();
  const selectedTabIndex = collectionTabs.findIndex(
    (tab) => tab.key == router.query.tab
  );
  const hasAuthorization = isAuthorizedAccount(ual, collection);

  const tabsRef = useRef(null);
  const [isAddBackground, setIsAddBackground] = useState(false);

  useEffect(() => {
    const tabsElement = tabsRef.current;

    window.addEventListener('scroll', () => {
      const { top } = tabsElement.getBoundingClientRect();
      setIsAddBackground(top <= 88);
    });
  }, []);

  function handleSelectedTabIndex(tabIndex: number) {
    router.push(
      `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[tabIndex].key}`,
      undefined,
      { shallow: true }
    );
  }

  return (
    <>
      <Head>
        <title>{`${collection.collection_name} - ${appName}`}</title>
      </Head>

      <Header.Root
        breadcrumb={[
          [
            hasAuthorization ? 'My Collections' : 'Explorer',
            hasAuthorization ? `/${chainKey}` : `/${chainKey}/explorer`,
          ],
          [collection.collection_name],
        ]}
      >
        <Header.Content title={collection.name} subtitle="Collection">
          <div className="flex flex-wrap gap-4 mt-4">
            {hasAuthorization ? (
              <Link
                href={`/${chainKey}/collection/${collection.collection_name}/edit`}
                className="btn"
              >
                Update Collection
              </Link>
            ) : (
              <Link
                href={`/${chainKey}/author/${collection.author}`}
                className="btn"
              >
                Created by {collection.author}
              </Link>
            )}
            <a
              href={collection.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Website
            </a>
          </div>
        </Header.Content>
        <Header.Banner
          images={[{ ipfs: collection.img, type: 'image' }]}
          unique
        />
      </Header.Root>

      <CollectionHints
        assets={assets}
        schemas={schemas}
        chainKey={chainKey}
        templates={templates}
        collection={collection}
      />

      <Tab.Group
        selectedIndex={selectedTabIndex}
        defaultIndex={0}
        onChange={handleSelectedTabIndex}
      >
        <Tab.List
          ref={tabsRef}
          className={`tab-list sticky top-[5.5rem] z-10 duration-75 ${
            isAddBackground ? 'bg-neutral-900' : ''
          }`}
        >
          <Tab className="tab">{collectionTabs[0].name}</Tab>
          <Tab className="tab">
            {collectionTabs[1].name}
            <span className="badge-small">{stats.schemas ?? '0'}</span>
          </Tab>
          <Tab className="tab">
            {collectionTabs[2].name}
            <span className="badge-small">{stats.templates ?? '0'}</span>
          </Tab>
          <Tab className="tab">
            {collectionTabs[3].name}
            <span className="badge-small">{stats.assets ?? '0'}</span>
          </Tab>
          <Tab className="tab">{collectionTabs[4].name}</Tab>
          {hasAuthorization && (
            <Tab className="tab">{collectionTabs[5].name}</Tab>
          )}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <CollectionStats stats={stats} collection={collection} />
          </Tab.Panel>
          <Tab.Panel>
            <CollectionSchemasList
              chainKey={chainKey}
              initialSchemas={schemas}
              totalSchemas={stats.schemas}
              collectionName={collection.collection_name}
              hasAuthorization={hasAuthorization}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CollectionTemplatesList
              chainKey={chainKey}
              initialTemplates={templates}
              totalTemplates={stats.templates}
              collectionName={collection.collection_name}
              hasAuthorization={hasAuthorization}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CollectionAssetsList
              chainKey={chainKey}
              initialAssets={assets}
              initialBurnedAssets={burnedAssets}
              totalAssets={stats.assets}
              totalBurned={stats.burned}
              collectionName={collection.collection_name}
              hasAuthorization={hasAuthorization}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CollectionAccountsList
              chainKey={chainKey}
              initialAccounts={accounts}
              collectionName={collection.collection_name}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CollectionPlugins
              chainKey={chainKey}
              collectionName={collection.collection_name}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const chainKey = context.params.chainKey as string;
  const collectionName = context.params.collectionName as string;

  try {
    const [
      { data: collection },
      { data: stats },
      { data: templates },
      { data: assets },
      { data: burnedAssets },
      { data: schemas },
      { data: accounts },
    ] = await Promise.all([
      getCollectionService(chainKey, { collectionName }),
      collectionStatsService(chainKey, { collectionName }),
      collectionTemplatesService(chainKey, { collectionName }),
      collectionAssetsService(chainKey, { collectionName, burned: false }),
      collectionAssetsService(chainKey, { collectionName, burned: true }),
      collectionSchemasService(chainKey, { collectionName }),
      collectionAccountsService(chainKey, { collectionName }),
    ]);

    return {
      props: {
        chainKey,
        collection: collection.data,
        stats: stats.data,
        templates: templates.data,
        assets: assets.data,
        burnedAssets: burnedAssets.data,
        schemas: schemas.data,
        accounts: accounts.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Collection);
