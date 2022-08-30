import { useState, useEffect } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import { CollectionItemsList } from '@components/collection/CollectionItemsList';
import { collectionsByAuthorService } from '@services/collection/collectionsByAuthorService';

const UserCollectionsList = ({ ual }) => {
    
    const [ collections, setCollections ] = useState([]);

    useEffect(() => {
        async function getLoggedCollections() {
            if (ual?.activeUser) {
                const { data:collections } = await collectionsByAuthorService({ author: ual.activeUser.accountName });
                setCollections(collections.data);
            }
        }
        getLoggedCollections();
    }, [ual])

    return (
        <>
            { ual?.activeUser && collections.length > 0 && (
                <div className="flex flex-col gap-20"> 

                    <CollectionItemsList title="My Collections" collections={collections} author={ual.activeUser.accountName} />
                </div>
            ) }
        </>
    )
}


export default withUAL(UserCollectionsList);