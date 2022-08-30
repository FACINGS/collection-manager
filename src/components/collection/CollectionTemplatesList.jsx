import { useState } from 'react';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';
import { LoadingIcon } from '@components/icons/LoadingIcon';
import { CollectionCard } from '@components/collection/CollectionCard';

export function CollectionTemplatesList({ templates, collection, totalTemplates }) {

    const [ templatesList, setTemplatesList ] = useState(templates);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ page, setPage ] = useState(1);

    const showMoreParameters = {
        page,
        setPage, 
        collection,
        setIsLoading, 
        updateList: setTemplatesList,
        service: collectionTemplatesService, 
    }
    
    return (
        <div className="flex flex-col md:max-w-auto max-w-fit">
            <div className="flex flex-col gap-8">
                <h1 className="text-xl font-bold">Templates in the collection ({totalTemplates})</h1>              
                <div className="w-full flex flex-row flex-wrap justify-start max-w-screen-md">
                    { 
                        templatesList.map((template, index) => {
                            return <CollectionCard item={template} key={index} isTemplate />;                            
                        })
                    }
                </div>
                { Number(totalTemplates) !== templatesList.length && (
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