import * as isIPFS from 'is-ipfs';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { convertToBase64 } from '@utils/convertToBase64';

export async function handlePreview(element, setImages) {
  const schema = element.schema.format;
  const immutableData =
    Object.keys(element.immutable_data).length > 0
      ? element.immutable_data
      : element.template.immutable_data;

  const data = await Promise.all(
    schema.map(async (item) => {
      if (
        isIPFS.cid(immutableData[item.name]) ||
        isIPFS.cidPath(immutableData[item.name])
      ) {
        const type = await handleIpfs(immutableData[item.name]);
        return {
          ipfs: immutableData[item.name],
          type: type,
        };
      }
    })
  );

  const filteredIpfs = data.filter((item) => item !== undefined);

  if (filteredIpfs.length > 0) {
    setImages(filteredIpfs);
  } else {
    setImages([{ type: '' }]);
  }
}

async function handleIpfs(ipfs) {
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
