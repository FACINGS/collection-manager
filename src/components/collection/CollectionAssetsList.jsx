import { useState } from 'react';
import { ipfsEndpoint } from '@configs/globalsConfig';
import Image from 'next/image';
import { collectionAssetsService } from '@services/collection/collectionAssetsService';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { LoadingIcon } from '@components/icons/LoadingIcon';

export function CollectionAssetsList({ assets, collection, totalAssets }) {
    
    const [ page, setPage ] = useState(1);
    const [ assetsToShow, setAssetsToShow ] = useState(assets);
    const [ isLoading, setIsLoading ] = useState(false);

    const showMoreParameters = {
        page,
        setPage, 
        collection,
        setIsLoading, 
        updateList: setAssetsToShow,
        service: collectionAssetsService, 
    }
    
    return (
        <div className="flex flex-col md:max-w-auto max-w-fit">
            <div className="flex flex-col gap-8">
                <h1 className="text-xl font-bold">Assets in the collection ({totalAssets ?? 0})</h1>              
                <div className="w-full flex flex-row flex-wrap justify-center md:justify-start max-w-screen-md">
                    {
                        assetsToShow.map((asset, index) => {
                            return (
                                <div key={index} className="flex flex-col items-center m-4 w-fit h-fit">
                                    <div className="bg-primary w-auto flex justify-center rounded-t-lg overflow-hidden">
                                        { asset?.data?.video ? 
                                            <video muted autoPlay loop playsInline className="w-40 h-40 object-cover">
                                                <source src={`${ipfsEndpoint}/${asset.data.video}`} type="video/mp4" />
                                            </video>
                                        : 
                                            <Image alt={asset.name} src={`${ipfsEndpoint}/${asset?.data?.img}`} width="160" height="160" objectFit="cover"/>
                                        }
                                    </div>
                                    <div className={`w-40 h-fit shadow-md p-2 max-w-40 rounded-b-lg flex flex-col bg-primary text-white text-center items-center relative`}>
                                        <h3 className="text-base font-bold border-solid border-white border-2 rounded-full w-fit px-4 absolute -top-[20%] bg-primary">#{asset?.template?.template_id}</h3>                      
                                        <div className="flex flex-col text-white text-center pt-2 w-full">                    
                                            <p className="text-base font-bold w-full truncate">{asset.name ? asset.name : 'No name'}</p>
                                            <p className="text-sm">{asset.owner ?? 'No owner'}</p>                        
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                { Number(totalAssets) !== assetsToShow.length && (
                    <div className="container flex justify-center my-2">
                        { isLoading ? 
                            (
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
                            ) 
                        }
                    </div>
                )}
            </div>
        </div>
    )
}