import { useState } from 'react';

import { ipfsEndpoint } from '@configs/globalsConfig';
import {
  collectionTemplatesService,
  TemplateProps,
} from '@services/collection/collectionTemplatesService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { CreateNewItem } from '@components/collection/CreateNewItem';

import { collectionTabs } from '@utils/collectionTabs';

interface CollectionTemplatesListProps {
  chainKey: string;
  initialTemplates: TemplateProps[];
  totalTemplates: number;
  collectionName: string;
  hasAuthorization: boolean;
}

export function CollectionTemplatesList({
  chainKey,
  initialTemplates,
  totalTemplates,
  collectionName,
  hasAuthorization,
}: CollectionTemplatesListProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 12;
  const currentPage = Math.ceil(templates.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = Number(totalTemplates) === templates.length;

  async function handleSeeMoreTemplates() {
    setIsLoading(true);

    try {
      const { data } = await collectionTemplatesService(chainKey, {
        collectionName,
        page: currentPage + 1,
        offset,
      });

      setTemplates((state) => [...state, ...data.data]);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  return (
    <section className="container">
      <h2 className="headline-2 my-8 flex items-center gap-2">
        {collectionTabs[2].name}
        <span className="badge-medium">{totalTemplates}</span>
      </h2>

      {templates.length > 0 ? (
        <>
          <CardContainer>
            {hasAuthorization && (
              <CreateNewItem
                href={`/${chainKey}/collection/${collectionName}/template/new`}
                label="Create template"
              />
            )}
            {templates.map((template) => (
              <Card
                key={template.template_id}
                id={template.template_id}
                href={`/${chainKey}/collection/${collectionName}/template/${template.template_id}`}
                image={
                  template.immutable_data.img ||
                  template.immutable_data.image ||
                  template.immutable_data.glbthumb
                    ? `${ipfsEndpoint}/${
                        template.immutable_data.img ||
                        template.immutable_data.image ||
                        template.immutable_data.glbthumb
                      }`
                    : ''
                }
                video={
                  template.immutable_data.video
                    ? `${ipfsEndpoint}/${template.immutable_data.video}`
                    : ''
                }
                title={template.name}
                subtitle={`${template.issued_supply} ${
                  Number(template.issued_supply) > 1 ? 'NFTs' : 'NFT'
                }`}
              />
            ))}
          </CardContainer>

          {!isEndOfList && (
            <div className="flex justify-center mt-8">
              <SeeMoreButton
                isLoading={isLoading}
                onClick={handleSeeMoreTemplates}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {hasAuthorization ? (
            <CreateNewItem
              href={`/${chainKey}/collection/${collectionName}/template/new`}
              label="Create your first template"
            />
          ) : (
            <div className="container mx-auto px-8 py-24 text-center">
              <h4 className="headline-3">
                There is no templates in this collection
              </h4>
            </div>
          )}
        </>
      )}
    </section>
  );
}
