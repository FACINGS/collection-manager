import { useState } from 'react';
import { CollectionItem } from '@components/collection/CollectionItem';
import { listCollectionsService } from '@services/collection/listCollectionsService';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { searchCollectionService } from '@services/collection/searchCollectionService';

export function CollectionItemsList({ collections }) {

    const [ page, setPage ] = useState(1);
    const [ collectionsList, setCollectionsList ] = useState(collections);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ search, setSearch ] = useState('');

    const showMoreParameters = {
        page,
        setPage,
        setIsLoading, 
        updateList: setCollectionsList,
        match: search,
        service: search.length > 0 ? searchCollectionService : listCollectionsService, 
    }

    async function handleSearchInput(e) {
        setSearch(e.target.value);
        if (e.target.value.length > 0) {
            const { data:match } = await searchCollectionService({ match: e.target.value });
            setCollectionsList(match.data);
        }
        if (e.target.value.length == 0) {
            const { data:collections } = await listCollectionsService({});
            setCollectionsList(collections.data);
        }
    }

    return (
        <div className="container mx-auto flex flex-col gap-10 justify-center">
            <h2 className="text-4xl pt-20 px-4">NFT Collections</h2>
            <input 
                type="search" 
                className="border-gray-100 border-solid border-2 w-auto rounded-lg h-10 p-4 mx-4 focus-within:shadow focus:border-gray-300 focus:outline-none" 
                placeholder="Search collection"
                value={search}
                onChange={handleSearchInput}
            />
            { collectionsList && collectionsList.length > 0 && (
                <>                
                    <div className="grid grid-flow-row-dense auto-rows-min md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 auto-cols-max place-items-center justify-center m-4">
                        { 
                            collectionsList.map((collection, index) => {
                                return <CollectionItem key={index} {...collection} />
                            })
                        }
                    </div>
                    <div className="container flex justify-center">
                        <button 
                            onClick={() => collectionShowMore(showMoreParameters)}
                            disabled={isLoading}
                            className="text-primary hover:text-white bg-white hover:bg-primary font-bold border-solid border-primary py-[0.5rem] px-[1rem] border-2 rounded-full"
                            >
                            { isLoading ? 'Loading...' : 'See more collections'}
                        </button>
                    </div>
                </>
            )}
            { collectionsList.length == 0 && (
                <div className="flex justify-center">
                    <h3 className="text-2xl">No Results!</h3>
                </div>
            ) }
        </div>
    )
}