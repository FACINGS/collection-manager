import { useState } from 'react';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { collectionAssetsService } from '@services/collection/collectionAssetsService';

import { Card } from '@components/Card';
import { CardContainer } from '@components/CardContainer';
import { SeeMoreButton } from '@components/SeeMoreButton';
import { CreateNewItem } from '@components/collection/CreateNewItem';

export function CollectionAssetsList({
  chainKey,
  initialAssets,
  totalAssets,
  totalBurned,
  collectionName,
  hasAuthorization,
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 12;
  const currentPage = Math.ceil(assets.length / limit);
  const offset = (currentPage - 1) * limit;
  const isEndOfList = Number(totalAssets) === assets.length;

  async function handleSeeMoreAssets() {
    setIsLoading(true);

    try {
      const { data } = await collectionAssetsService(chainKey, {
        collectionName,
        page: currentPage + 1,
        offset,
      });

      setAssets((state) => [...state, ...data.data]);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  return (
    <>
      <section className="container">
        <h2 className="headline-2 my-8 flex items-center gap-2">
          NFTs <span className="badge-medium">{totalAssets ?? 0}</span>
        </h2>

        {assets.length > 0 ? (
          <>
            <CardContainer>
              {hasAuthorization && (
                <CreateNewItem
                  href={`/${chainKey}/collection/${collectionName}/asset/new`}
                  label="Create NFT"
                />
              )}
              {assets.map((asset) => (
                <Card
                  key={asset.asset_id}
                  id={asset.template.template_id}
                  href={`/${chainKey}/collection/${collectionName}/asset/${asset.asset_id}`}
                  image={
                    asset.data.img ? `${ipfsEndpoint}/${asset.data.img}` : ''
                  }
                  video={
                    asset.data.video
                      ? `${ipfsEndpoint}/${asset.data.video}`
                      : ''
                  }
                  title={asset.name}
                  subtitle={`By ${asset.owner}`}
                />
              ))}
            </CardContainer>

            {!isEndOfList && (
              <div className="flex justify-center mt-8">
                <SeeMoreButton
                  isLoading={isLoading}
                  onClick={handleSeeMoreAssets}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {hasAuthorization ? (
              <CreateNewItem
                href={`/${chainKey}/collection/${collectionName}/asset/new`}
                label="Create your first NFT"
              />
            ) : (
              <div className="container mx-auto px-8 py-24 text-center">
                <h4 className="headline-3">
                  There is no NFTs in this collection
                </h4>
              </div>
            )}
          </>
        )}
      </section>

      <section className="container">
        <h2 className="headline-2 my-8 flex items-center gap-2">
          Burned <span className="badge-medium">{totalBurned ?? 0}</span>
        </h2>

        {assets.length > 0 ? (
          <>
            <CardContainer>
              {assets
                .filter((asset) => asset.burned_by_account)
                .map((asset) => (
                  <Card
                    key={asset.asset_id}
                    id={asset.template.template_id}
                    href={`/${chainKey}/collection/${collectionName}/asset/${asset.asset_id}`}
                    image={
                      asset.data.img ? `${ipfsEndpoint}/${asset.data.img}` : ''
                    }
                    video={
                      asset.data.video
                        ? `${ipfsEndpoint}/${asset.data.video}`
                        : ''
                    }
                    title={asset.name}
                    subtitle={`Burned by ${asset.burned_by_account}`}
                  />
                ))}
            </CardContainer>

            {!isEndOfList && (
              <div className="flex justify-center mt-8">
                <SeeMoreButton
                  isLoading={isLoading}
                  onClick={handleSeeMoreAssets}
                />
              </div>
            )}
          </>
        ) : (
          <div className="container mx-auto px-8 py-24 text-center">
            <h4 className="headline-3">
              There is no burned NFTs in this collection
            </h4>
          </div>
        )}
      </section>
    </>
  );
}
