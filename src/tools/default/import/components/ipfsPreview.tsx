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
    const handlePreview = async (immutable) => {
      const data = await Promise.all(
        immutable.map(async (item) => {
          if (isIPFS.cid(item.value[1]) || isIPFS.cidPath(item.value[1])) {
            const type = await handleIpfs(item.value[1]);
            return {
              ipfs: item.value[1],
              type: type,
            };
          }
        })
      );

      const filteredIpfs = data.filter((item) => item !== undefined);

      if (filteredIpfs.length > 0) {
        setImages(filteredIpfs);
      } else {
        setImages([{ ipfs: '', type: '' }]);
      }
    };

    handlePreview(immutableData);
  }, [immutableData]);

  if (images.length > 0) {
    return (
      <div className="flex flex-col w-full max-w-xs">
        <Carousel images={images} />
      </div>
    );
  }
}
