import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getAssetService(chainKey, { assetId }) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/assets/${assetId}`;

  const response = await api.get(url);

  return response;
}
