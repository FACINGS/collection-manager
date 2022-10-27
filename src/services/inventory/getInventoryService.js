import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getInventoryService(chainKey, options) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/assets`;

  const { page = 1, offset = 0, owner, collection_name } = options;

  const response = await api.get(url, {
    params: {
      owner,
      collection_name,
      page,
      limit: 12,
      offset,
      order: 'desc',
      sort: 'transferred_at_time',
    },
  });

  return response;
}
