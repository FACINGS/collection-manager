import { useState } from 'react';
import { ipfsEndpoint } from '@configs/globalsConfig';
import Image from 'next/image';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';
import { LoadingIcon } from '@components/icons/LoadingIcon';

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
                            return (
                                <div key={index} className="flex flex-col items-center m-4 w-fit h-fit">
                                    <div className="bg-primary w-auto flex justify-start rounded-t-lg overflow-hidden">
                                        { template.immutable_data.video ? 
                                            <video muted autoPlay loop playsInline className="w-40 h-40 object-cover">
                                                <source src={`${ipfsEndpoint}/${template.immutable_data.video}`} type="video/mp4" />
                                            </video>
                                        : 
                                            <Image alt={template.name} src={`${ipfsEndpoint}/${template.immutable_data.img}`} width="160" height="160" objectFit="cover"/>
                                        }
                                    </div>
                                    <div className={`w-40 h-fit shadow-md p-2 max-w-40 rounded-b-lg flex flex-col bg-primary text-white text-center items-center relative`}>
                                        <h3 className="text-base font-bold border-solid border-white border-2 rounded-full w-fit px-4 absolute -top-[20%] bg-primary">#{template.template_id}</h3>                      
                                        <div className="flex flex-col text-white text-center pt-2 w-full">                    
                                            <p className="text-base font-bold w-full truncate">{template.name ? template.name : 'No name'}</p>
                                            <p className="text-sm">{template.issued_supply} Assets</p>                        
                                        </div>
                                    </div>
                                </div>
                            )
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