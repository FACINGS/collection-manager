import { useEffect, useState } from 'react';
import * as isIPFS from 'is-ipfs';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { convertToBase64 } from '@utils/convertToBase64';

import { Carousel } from '@components/Carousel';

interface ImmutableDataProps {
  immutableData: {
    key: string;
    value: any[];
  }[];
}

interface ImagesProps {
  ipfs: string;
  type: string;
}

export function IpfsPreview({ immutableData }: ImmutableDataProps) {
  const [images, setImages] = useState<ImagesProps[]>([]);

  const handlePreview = async () => {
    const data = await Promise.all(
      immutableData.map(async (item) => {
        if (isIPFS.cid(item.value[1]) || isIPFS.cidPath(item.value[1])) {
          const type = await handleIpfs(item.value[1]);
          return {
            ipfs: item.value[1],
            type: type,
          };
        }
      })
    );

    setImages(data.filter((item) => item !== undefined));
  };

  async function handleIpfs(ipfs: string) {
    try {
      const result = await fetch(`${ipfsEndpoint}/${ipfs}`);
      const data = await result.blob();
      const preview = (await convertToBase64(data)) as string;
      const previewType = preview.replace(/^data:([^/]+).*/, '$1');

      return previewType;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handlePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full max-w-xs">
      <Carousel images={images} />
    </div>
  );
}
