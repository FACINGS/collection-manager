import { useState, useEffect, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';

import { getCollectionService } from '@services/collection/getCollectionService';
import { collectionStatsService } from '@services/collection/collectionStatsService';
import { collectionAssetsService } from '@services/collection/collectionAssetsService';
import { collectionSchemasService } from '@services/collection/collectionSchemasService';
import { collectionAccountsService } from '@services/collection/collectionAccountsService';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';

import { CollectionTemplatesList } from '@components/collection/CollectionTemplatesList';
import { CollectionAccountsList } from '@components/collection/CollectionAccountsList';
import { CollectionSchemasList } from '@components/collection/CollectionSchemasList';
import { CollectionAssetsList } from '@components/collection/CollectionAssetsList';
import { CollectionHeader } from '@components/collection/CollectionHeader';
import { CollectionStats } from '@components/collection/CollectionStats';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

function Collection({
  ual,
  chainKey,
  collection,
  stats,
  templates,
  assets,
  schemas,
  accounts,
}) {
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

  return (
    <>
      <CollectionHeader
        name={collection.name}
        author={collection.author}
        image={collection.img}
        link={collection.data.url}
        collection={collection.collection_name}
      />
      <Tab.Group>
        <Tab.List
          ref={tabsRef}
          className={`tab-list sticky top-[5.5rem] z-10 duration-75 ${
            isAddBackground ? 'bg-neutral-900' : ''
          }`}
        >
          <Tab className="tab">Details</Tab>
          <Tab className="tab">
            Schemas
            <span className="badge-small">{stats.schemas ?? '0'}</span>
          </Tab>
          <Tab className="tab">
            Templates
            <span className="badge-small">{stats.templates ?? '0'}</span>
          </Tab>
          <Tab className="tab">
            NFTs
            <span className="badge-small">{stats.assets ?? '0'}</span>
          </Tab>
          <Tab className="tab">Accounts</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <CollectionStats
              stats={stats}
              collectionCreatedAt={collection.created_at_time}
              collectionDescription={collection.data.description}
            />
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
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export async function getServerSideProps(context) {
  const { chainKey, collectionName } = context.params;

  try {
    const [
      { data: collection },
      { data: stats },
      { data: templates },
      { data: assets },
      { data: schemas },
      { data: accounts },
    ] = await Promise.all([
      getCollectionService(chainKey, { collectionName }),
      collectionStatsService(chainKey, { collectionName }),
      collectionTemplatesService(chainKey, { collectionName }),
      collectionAssetsService(chainKey, { collectionName }),
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
        schemas: schemas.data,
        accounts: accounts.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: `/${chainKey}`,
        permanent: false,
      },
    };
  }
}

export default withUAL(Collection);
