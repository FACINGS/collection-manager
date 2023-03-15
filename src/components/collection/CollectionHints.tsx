import { useEffect, useState } from 'react';
import { WarningCircle } from 'phosphor-react';
import { useRouter } from 'next/router';

import { AssetProps } from '@services/collection/collectionAssetsService';
import { SchemaProps } from '@services/collection/collectionSchemasService';
import { CollectionProps } from '@services/collection/getCollectionService';
import { TemplateProps } from '@services/collection/collectionTemplatesService';

interface CollectionHintsProps {
  schemas?: SchemaProps[];
  templates?: TemplateProps[];
  assets?: AssetProps[];
  chainKey: string;
  collection: CollectionProps;
}

interface ContentProps {
  title: string;
  description: string;
  redirect: string;
  button: string;
}

export function CollectionHints({
  schemas,
  assets,
  chainKey,
  templates,
  collection,
}: CollectionHintsProps) {
  const router = useRouter();
  const [content, setContent] = useState<ContentProps>(null);

  useEffect(() => {
    if (schemas.length === 0) {
      setContent({
        title: `Create your first schema`,
        description: `Schemas allows you to set the desired NFT attributes and their types.`,
        redirect: `/${chainKey}/collection/${collection?.collection_name}/schema/new`,
        button: 'Create Schema',
      });
    }

    if (templates.length === 0 && schemas.length > 0) {
      setContent({
        title: `Create your first template`,
        description: `Templates allow you to set values for your schema attributes, and will be used to mint NFTs.`,
        redirect: `/${chainKey}/collection/${collection?.collection_name}/template/new`,
        button: 'Create Template',
      });
    }

    if (templates.length > 0 && schemas.length > 0 && assets.length === 0) {
      setContent({
        title: `Create your first NFT`,
        description: `Your NFT will be based on the schema and templates you've created.`,
        redirect: `/${chainKey}/collection/${collection?.collection_name}/asset/new`,
        button: 'Create NFT',
      });
    }
  }, [schemas, templates, assets, chainKey, collection]);

  if (schemas.length > 0 && templates.length > 0 && assets.length > 0) {
    return;
  }

  if (content && Object.keys(content).length > 0) {
    return (
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between p-8 mb-8 gap-4 bg-neutral-800 text-white rounded-md w-full">
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-yellow-400/10 p-3.5 rounded-full">
              <WarningCircle size={28} className="text-yellow-600" />
            </div>
            <div className="flex flex-col  items-start">
              <h3 className="title-1">{content['title']}</h3>
              <span className="body-2">{content['description']}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            <button
              type="button"
              className="btn bg-neutral-900 text-white w-full sm:w-fit whitespace-nowrap"
              onClick={() => router.push(content['redirect'])}
            >
              {content['button']}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
