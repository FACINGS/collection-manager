import { ipfsEndpoint } from '@configs/globalsConfig';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NoImageIcon } from '@components/icons/NoImageIcon';

export function CollectionItem(collection) {
    const router = useRouter();

    const handleRoute = (e) => {
        e.preventDefault()
        router.push(`collections/${collection.collection_name}`);
    }
    
    return (
        <div 
            className="w-auto max-w-xs text-center flex flex-col gap-md drop-shadow-md hover:drop-shadow-xl bg-white rounded-2xl cursor-pointer p-md relative place-self-stretch"
            onClick={handleRoute}
        >
            <div className="bg-primary rounded-t-2xl w-full flex flex-1 justify-center overflow-hidden items-center">
                {
                    collection.img ? (
                        <Image alt={collection.name} src={`${ipfsEndpoint}/${collection.img}`} width="320" height="320" objectFit="cover"/>
                    ) : (
                        <div className="w-auto h-full items-center flex justify-center pt-[100%] relative">
                            <div className="absolute top-0 left-0 -translate-x-[50%] translate-y-[40%]">
                                <NoImageIcon />
                            </div>
                        </div>
                    ) 
                }
            </div>
            <div className="max-w-xs">
                <p className="text-2xl font-bold text-primary truncate">
                    {collection.name || 'No name'}
                </p>
                <p className="text-primary">
                    <span className="text-slate-300">by </span>
                    {collection.author}
                </p>
            </div>
        </div>
    )
}
