import { useState } from 'react';

import { collectionSchemasService } from '@services/collection/collectionSchemasService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { CreateNewItem } from '@components/collection/CreateNewItem';

export function CollectionSchemasList({
  chainKey,
  initialSchemas,
  totalSchemas,
  collectionName,
  hasAuthorization,
}) {
  const [schemas, setSchemas] = useState(initialSchemas);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 12;
  const currentPage = Math.ceil(schemas.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = Number(totalSchemas) === schemas.length;

  async function handleSeeMoreSchemas() {
    setIsLoading(true);

    try {
      const { data } = await collectionSchemasService(chainKey, {
        collectionName,
        page: currentPage + 1,
        offset,
      });

      setSchemas((state) => [...state, ...data.data]);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  return (
    <section className="container">
      <h2 className="headline-2 my-8 flex items-center gap-2">
        Schemas <span className="badge-medium">{totalSchemas}</span>
      </h2>
      {schemas.length > 0 ? (
        <>
          <CardContainer>
            {hasAuthorization && (
              <CreateNewItem
                href={`/${chainKey}/collection/${collectionName}/schema/new`}
                label="Create Schema"
                horizontal
              />
            )}
            {schemas.map((schema) => (
              <Card
                key={schema.schema_name}
                title={schema.schema_name}
                subtitle={`${schema.format.length} Attributes`}
                href={`/${chainKey}/collection/${collectionName}/schema/${schema.schema_name}`}
                withThumbnail={false}
              />
            ))}
          </CardContainer>

          {!isEndOfList && (
            <div className="flex justify-center mt-8">
              <SeeMoreButton
                isLoading={isLoading}
                onClick={handleSeeMoreSchemas}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {hasAuthorization ? (
            <CreateNewItem
              href={`/${chainKey}/collection/${collectionName}/schema/new`}
              label="Create your first schema"
            />
          ) : (
            <div className="container mx-auto px-8 py-24 text-center">
              <h4 className="headline-3">
                There is no schemas in this collection
              </h4>
            </div>
          )}
        </>
      )}
    </section>
  );
}
