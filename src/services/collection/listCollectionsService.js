import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function listCollectionsService(chainKey, options) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/collections`;

  const { page = 1, offset = 0, author, match } = options;

  const response = await api.get(url, {
    params: {
      author,
      match,
      page,
      limit: 12,
      offset,
      order: 'desc',
      sort: 'created',
    },
  });

  return response;
}
