import { ipfsEndpoint } from '@configs/globalsConfig';
import Image from 'next/image';

export function CollectionCard({ item, key, isTemplate }) {
    
    function handleImage() {
        const videoSrc = isTemplate ? item.immutable_data.video :item?.data?.video;
        const imageSrc = isTemplate ? item.immutable_data.img :item?.data?.img;

        return (
            <>
                { videoSrc ? 
                    <video muted autoPlay loop playsInline className="w-40 h-40 object-cover">
                        <source src={`${ipfsEndpoint}/${videoSrc}`} type="video/mp4" />
                    </video>
                : 
                    <Image alt={item.name} src={`${ipfsEndpoint}/${imageSrc}`} width="160" height="160" objectFit="cover"/>
                }
            </>
        )
    }

    return (
        <div key={key} className="flex flex-col items-center m-4 w-fit h-fit">
            <div className="bg-primary w-auto flex justify-center rounded-t-lg overflow-hidden">
                { handleImage() }
            </div>
            <div className={`w-40 h-fit shadow-md p-2 max-w-40 rounded-b-lg flex flex-col bg-primary text-white text-center items-center relative`}>
                <h3 className="text-base font-bold border-solid border-white border-2 rounded-full w-fit px-4 absolute -top-[20%] bg-primary">
                    #{!isTemplate ? item?.template?.template_id : item.template_id}
                </h3>                      
                <div className="flex flex-col text-white text-center pt-2 w-full">                    
                    <p className="text-base font-bold w-full truncate">{item.name ? item.name : 'No name'}</p>
                    { !isTemplate ? 
                        (<p className="text-sm">{item.owner ?? 'No owner'}</p>) : 
                        (<p className="text-sm">{item.issued_supply} Assets</p>)
                    }                        
                </div>
            </div>
        </div>
    )
}