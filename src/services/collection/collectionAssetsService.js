import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function collectionAssetsService(
  chainKey,
  { collectionName, page, offset }
) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/assets?collection_name=${collectionName}`;

  const response = await api.get(url, {
    params: {
      page: page || 1,
      limit: 12,
      offset: offset || 12,
      order: 'desc',
      sort: 'asset_id',
    },
  });

  return response;
}
