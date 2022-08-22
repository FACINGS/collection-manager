import { useState } from 'react';
import Image from 'next/image';
import { collectionShowMore } from '@hooks/collectionShowMore';
import { collectionAccountsService } from '@services/collection/collectionAccountsService';
import { LoadingIcon } from '@components/icons/LoadingIcon';

export function CollectionAccountsList({ accounts, collection }) {

    const [ counter, setCounter ] = useState(12);
    
    const [ accountsList, setAccountsList ] = useState(accounts);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ page, setPage ] = useState(1);

    const showMoreParameters = {
        page,
        setPage, 
        collection,
        setIsLoading, 
        updateList: setAccountsList,
        service: collectionAccountsService, 
    }
    
    return (
        <div className="flex flex-col md:max-w-auto max-w-fit">
            <div className="flex flex-col gap-8">
                <h1 className="text-xl font-bold">Accounts holding this collection ({accountsList.length})</h1>              
                <div className="w-full flex flex-row flex-wrap justify-center md:justify-start max-w-screen-md">
                    { 
                        accountsList.map((account, index) => {
                            return (
                                <div key={index} className="flex flex-col items-center m-4 w-fit h-fit">
                                    <div className="bg-primary w-full flex justify-center rounded-t-lg overflow-hidden px-4 pt-4">
                                        <Image alt={account.name} src={`https://robohash.org/${account.account}.png?set=set4`} width="80" height="80" objectFit="contain"/>
                                    </div>
                                    <div className={`w-40 h-fit shadow-md p-4 max-w-40 rounded-b-lg flex flex-col bg-primary text-white text-center items-center relative`}>
                                        <p className="text-base font-bold w-full truncate">{account.account}</p>
                                        <p className="text-sm">{account.assets} Assets</p>                        
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                { !(accountsList.length < counter) && (
                    <div className="container flex justify-center my-2">
                        { isLoading ? 
                            (
                                <div className="flex flex-row w-fit h-fit justify-center rounded-full items-center gap-4 bg-primary py-2 px-4 border-primary border-2">
                                    <LoadingIcon />
                                    <p className="text-white font-bold">Loading...</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {collectionShowMore(showMoreParameters); setCounter(counter + 12)}}
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