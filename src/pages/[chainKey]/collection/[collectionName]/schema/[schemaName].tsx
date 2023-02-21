import { Tab } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import Link from 'next/link';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { ipfsEndpoint, appName } from '@configs/globalsConfig';

import { Card } from '@components/Card';
import { Header } from '@components/Header';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import {
  getSchemaService,
  SchemaProps,
} from '@services/schema/getSchemaService';
import { collectionTabs } from '@utils/collectionTabs';

interface SchemaViewProps {
  ual: any;
  chainKey: string;
  schema: SchemaProps;
}

function Schema({ chainKey, ual, schema }: SchemaViewProps) {
  const collection = schema.collection;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  return (
    <>
      <Head>
        <title>{`Schema ${schema.schema_name} - ${appName}`}</title>
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
            collectionTabs[1].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[1].key}`,
          ],
          [schema.schema_name],
        ]}
      >
        <Header.Content title={schema.schema_name} subtitle="Schema">
          {hasAuthorization && (
            <Link
              href={`/${chainKey}/collection/${collection.collection_name}/schema/${schema.schema_name}/edit`}
              className="btn mt-4"
            >
              Update Schema
            </Link>
          )}
        </Header.Content>
      </Header.Root>

      <Tab.Group>
        <Tab.List className="tab-list mb-4 md:mb-8">
          <Tab className="tab">Information</Tab>
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
                  <span className="headline-3 mb-4 block">Attributes</span>
                  {schema.format.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center py-3 body-2 gap-8 text-white border-b border-neutral-700"
                    >
                      <span>{item.name}</span>
                      <span className="font-bold break-all">{item.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;
  const schemaName = params.schemaName as string;

  try {
    const { data } = await getSchemaService(chainKey, {
      collectionName,
      schemaName,
    });

    return {
      props: {
        chainKey,
        schema: data.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Schema);
