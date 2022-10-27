import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function collectionAccountsService(
  chainKey,
  { collectionName, page, offset }
) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/accounts?collection_name=${collectionName}`;

  const response = await api.get(url, {
    params: {
      page: page || 1,
      limit: 12,
      offset: offset || 12,
      order: 'desc',
    },
  });

  return response;
}
