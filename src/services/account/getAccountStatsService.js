import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getAccountStatsService(chainKey, accountName) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/accounts/${accountName}`;

  const response = await api.get(url);

  return response;
}
