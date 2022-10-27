import { Tab } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import Link from 'next/link';

import { ipfsEndpoint } from '@configs/globalsConfig';

import { Card } from '@components/Card';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getSchemaService } from '@services/schema/getSchemaService';

function Schema({ chainKey, ual, schema }) {
  const collection = schema.collection;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  return (
    <>
      <header className="-mt-14 overflow-hidden -z-10">
        <div className="container flex items-center">
          <div className="flex-1 py-32">
            <p className="headline-3 mb-2">Schema</p>
            <h1 className="headline-1">{schema.schema_name}</h1>
            <div className="flex gap-4 mt-8">
              {hasAuthorization && (
                <Link
                  href={`/${chainKey}/collection/${collection.collection_name}/schema/${schema.schema_name}/edit`}
                >
                  <a className="btn">Edit Schema</a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <Tab.Group>
        <Tab.List className="tab-list -mt-14 mb-14">
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

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName, schemaName } = params;

  const { data: schema } = await getSchemaService(chainKey, {
    collectionName,
    schemaName,
  });

  return {
    props: {
      chainKey,
      schema: schema.data,
    },
  };
}

export default withUAL(Schema);
