import axios from 'axios';
import { ipfsJwt } from '@configs/globalsConfig';

export async function uploadImageToIpfsService(image) {
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
        'Content-Type': `multipart/form-data boundary=${data._boundary}`,
      },
    });

    return uploadedImage;
  } catch (e) {
    console.error('uploadImageToIpfsService error:', e);
  }
}
