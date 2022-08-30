import { useState } from 'react';
import { collectionSchemasService } from '@services/collection/collectionSchemasService';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { LoadingIcon } from '@components/icons/LoadingIcon';

export function CollectionSchemasList({ schemas, collection, totalSchemas }) {
  const [page, setPage] = useState(1);
  const [schemasList, setSchemasList] = useState(schemas);
  const [isLoading, setIsLoading] = useState(false);

  const showMoreParameters = {
    page,
    setPage,
    collection,
    setIsLoading,
    updateList: setSchemasList,
    service: collectionSchemasService,
  };

  return (
    <div className="flex flex-col md:max-w-auto max-w-fit">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-bold">
          Schemas in the collection ({totalSchemas})
        </h1>
        <div className="w-full flex flex-row flex-wrap justify-center md:justify-start max-w-screen-md">
          {schemasList.map((schema, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center m-4 w-fit h-fit"
              >
                <div
                  className={`w-40 h-fit shadow-md p-4 max-w-40 rounded-lg flex flex-col bg-primary text-white text-center items-center relative`}
                >
                  <h3 className="text-xl font-bold bg-primary border-b-2 border-solid border-white w-full pb-2">
                    {schema.schema_name}
                  </h3>
                  <div className="flex flex-col text-white text-center pt-2 w-full">
                    <p className="text-base font-bold w-full truncate">
                      {collection}
                    </p>
                    <p className="text-sm">{schema.format.length} Attributes</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {Number(totalSchemas) !== schemasList.length && (
          <div className="container flex justify-center my-2">
            {isLoading ? (
              <div className="flex flex-row w-fit h-fit justify-center rounded-full items-center gap-4 bg-primary py-2 px-4 border-primary border-2">
                <LoadingIcon />
                <p className="text-white font-bold">Loading...</p>
              </div>
            ) : (
              <button
                onClick={() => collectionShowMore(showMoreParameters)}
                disabled={isLoading}
                className="text-primary hover:text-white bg-white hover:bg-primary font-bold border-solid border-primary py-2 px-4 border-2 rounded-full"
              >
                See more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
