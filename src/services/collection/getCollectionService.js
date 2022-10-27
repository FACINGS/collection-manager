import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getCollectionService(chainKey, { collectionName }) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/collections/${collectionName}`;

  const response = await api.get(url);

  return response;
}
