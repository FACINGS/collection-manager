import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function collectionSchemasService(
  chainKey,
  { collectionName, page, offset }
) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/schemas?collection_name=${collectionName}`;

  const response = await api.get(url, {
    params: {
      page: page || 1,
      limit: 12,
      offset: offset || 12,
      order: 'desc',
      sort: 'created',
    },
  });

  return response;
}
