import { useState } from 'react';
import { collectionAssetsService } from '@services/collection/collectionAssetsService';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { LoadingIcon } from '@components/icons/LoadingIcon';
import { CollectionCard } from '@components/collection/CollectionCard';

export function CollectionAssetsList({ assets, collection, totalAssets }) {
  const [page, setPage] = useState(1);
  const [assetsToShow, setAssetsToShow] = useState(assets);
  const [isLoading, setIsLoading] = useState(false);

  const showMoreParameters = {
    page,
    setPage,
    collection,
    setIsLoading,
    updateList: setAssetsToShow,
    service: collectionAssetsService,
  };

  return (
    <div className="flex flex-col md:max-w-auto max-w-fit">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-bold">
          Assets in the collection ({totalAssets ?? 0})
        </h1>
        <div className="w-full flex flex-row flex-wrap justify-center md:justify-start max-w-screen-md">
          {assetsToShow.map((asset) => {
            return <CollectionCard key={asset.asset_id} item={asset} />;
          })}
        </div>
        {Number(totalAssets) !== assetsToShow.length && (
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
