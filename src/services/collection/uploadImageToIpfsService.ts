import axios from 'axios';
import { ipfsJwt } from '@configs/globalsConfig';
import { AxiosResponse } from 'axios';

interface IPFSProps {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

interface DataProps {
  data: IPFSProps;
}

export const uploadImageToIpfsService = async (
  image: File
): Promise<AxiosResponse<DataProps>> => {
  if (!image) return null;

  try {
    let data = new FormData();
    data.append('file', image);

    const { data: uploadedImage } = await axios({
      method: 'POST',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      headers: {
        Authorization: `Bearer ${ipfsJwt}`,
        'Content-Type': `multipart/form-data boundary=${data['_boundary']}`,
      },
    });

    return uploadedImage;
  } catch (e) {
    console.error('uploadImageToIpfsService error:', e);
  }
};
