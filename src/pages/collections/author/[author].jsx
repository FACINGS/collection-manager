import { useRouter } from "next/router"

import { collectionsByAuthorService } from '@services/collection/collectionsByAuthorService';

import { Loading } from '@components/Loading';

import Image from 'next/image';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { ArrowLeftIcon } from "@components/icons/ArrowLeftIcon";
import { NoImageIcon } from '@components/icons/NoImageIcon';

export default function Collection({ collections }) {
    
    const router = useRouter();

    if (router.isFallback) {
        return <Loading />;
    }

    function handleImage(collection) {
        if (collection?.data?.video) {
            return (
                <video muted autoPlay loop playsInline className="w-40 h-40 object-cover">
                    <source src={`${ipfsEndpoint}/${collection.data.video}`} type="video/mp4" />
                </video>
            );
        }
        
        if (collection.data.img) {
            return <Image alt={collection.name} src={`${ipfsEndpoint}/${collection?.data?.img}`} width="160" height="160" objectFit="cover"/>;
        }

        return (
            <div className="w-auto h-full items-center flex justify-center pt-[100%] relative">
                <div className="absolute top-0 left-0 -translate-x-[50%] translate-y-[50%]">
                    <NoImageIcon width="80" height="80" />
                </div>
            </div>
        )
    }

    return (
        <div className="py-20 flex flex-col container mx-auto justify-center items-center relative gap-10">
            <div className="absolute left-0 top-4 p-4 cursor-pointer" onClick={() => router.back()}>
                <ArrowLeftIcon width="32" height="32" />
            </div>
            <div className="gap-2 flex flex-row mt-4 mx-4 md:mx-0 items-baseline justify-center md:justify-start">
                <h2 className="text-3xl whitespace-nowrap">Collections by</h2>
                <h2 className="font-bold text-3xl">{`${collections[0].author}`}</h2>
            </div>
            <div className="w-fit flex flex-row flex-wrap justify-center md:justify-start max-w-screen-md bg-white drop-shadow-md rounded-lg">
                {
                    collections.map((collection, index) => {
                        return (
                            <div key={index} className="flex flex-col items-center m-4 w-fit h-fit cursor-pointer" onClick={() => router.push(`/collections/${collection.collection_name}`)}>
                                <div className="bg-primary rounded-t-2xl w-full flex flex-1 justify-center overflow-hidden items-center">
                                    { handleImage(collection) }
                                </div>
                                <div className={`w-40 h-fit shadow-md p-4 max-w-40 rounded-b-lg flex flex-col bg-primary text-white text-center items-center relative`}>                                 
                                    <p className="text-base font-bold w-full truncate">{collection.name ? collection.name : 'No name'}</p>
                                    <p className="text-sm">{collection.owner}</p>                        
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true
    }
}

export async function getStaticProps(context) {
    const { author } = context.params;

    const { data:collections } = await collectionsByAuthorService({ author });

    return {
        props: {
            collections: collections.data,
        }
    };
}