import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function collectionStatsService(chainKey, { collectionName }) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/collections/${collectionName}/stats`;

  const response = await api.get(url);

  return response;
}
