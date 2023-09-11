import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { ipfsEndpoint, appName } from '@configs/globalsConfig';

import { getTemplateService } from '@services/template/getTemplateService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';
import {
  collectionAssetsService,
  AssetProps,
} from '@services/collection/collectionAssetsService';
import {
  collectionSchemasService,
  SchemaProps,
} from '@services/collection/collectionSchemasService';
import {
  collectionTemplatesService,
  TemplateProps,
} from '@services/collection/collectionTemplatesService';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';
import { collectionTabs } from '@utils/collectionTabs';
import { handlePreview } from '@utils/handlePreview';

import { Card } from '@components/Card';
import { Header } from '@components/Header';
import { Attributes } from '@components/Attributes';
import { CollectionHints } from '@components/collection/CollectionHints';

interface TemplateViewProps {
  ual: any;
  chainKey: string;
  template: TemplateProps;
  assets: AssetProps[];
  schemas: SchemaProps[];
  templates: TemplateProps[];
  collection: CollectionProps;
}

function Template({
  ual,
  chainKey,
  template,
  assets,
  schemas,
  templates,
}: TemplateViewProps) {
  const collection = template.collection;
  const [images, setImages] = useState([]);

  useEffect(() => {
    handlePreview(template, setImages);
  }, [template]);

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  return (
    <>
      <Head>
        <title>{`Template #${template.template_id} - ${appName}`}</title>
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
            collectionTabs[2].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[2].key}`,
          ],
          [`${template.name}`],
        ]}
      >
        <Header.Content
          title={template.name}
          subtitle={`Template #${template.template_id}`}
        >
          {hasAuthorization && (
            <Link
              href={`/${chainKey}/collection/${collection.collection_name}/template/${template.template_id}/edit`}
              className="btn mt-4 w-fit"
            >
              Lock Template
            </Link>
          )}
        </Header.Content>
        <Header.Banner images={images} />
      </Header.Root>

      {hasAuthorization && (
        <CollectionHints
          assets={assets}
          schemas={schemas}
          chainKey={chainKey}
          templates={templates}
          collection={collection}
        />
      )}

      <Tab.Group>
        <Tab.List className="tab-list mb-14">
          <Tab className="tab">Information</Tab>
          <Tab className="tab">Immutable data</Tab>
        </Tab.List>
        <Tab.Panels className="container">
          <Tab.Panel>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-0 justify-center">
              <div className="grid grid-cols-1">
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
                    <span>Schema</span>
                    <Link
                      href={`/${chainKey}/collection/${collection.collection_name}/schema/${template.schema.schema_name}`}
                      className="font-bold underline"
                    >
                      {template.schema.schema_name}
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Burnable</span>
                    <span className="font-bold">
                      {template.is_burnable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Transferable</span>
                    <span className="font-bold">
                      {template.is_transferable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Issued Supply</span>
                    <span className="font-bold">{template.issued_supply}</span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-zinc-700">
                    <span>Max Supply</span>
                    <span className="font-bold">
                      {parseInt(template.max_supply, 10) || 'Infinite'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <Attributes.List>
              {template.schema.format.map((schema) => (
                <Attributes.Item
                  key={schema.name}
                  name={schema.name}
                  type={schema.type}
                  value={template.immutable_data[schema.name]}
                />
              ))}
            </Attributes.List>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;
  const templateId = params.templateId as string;

  try {
    const [
      { data: collection },
      { data: templates },
      { data: schemas },
      { data: assets },
      { data: template },
    ] = await Promise.all([
      getCollectionService(chainKey, { collectionName }),
      collectionTemplatesService(chainKey, { collectionName }),
      collectionSchemasService(chainKey, { collectionName }),
      collectionAssetsService(chainKey, { collectionName }),
      getTemplateService(chainKey, { collectionName, templateId }),
    ]);

    return {
      props: {
        chainKey,
        assets: assets.data,
        schemas: schemas.data,
        template: template.data,
        templates: templates.data,
        collection: collection.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Template);
