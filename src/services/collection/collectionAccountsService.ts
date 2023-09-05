import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface AccountProps {
  account: string;
  assets: string;
}

interface DataProps {
  data: AccountProps[];
}

interface ParamsProps {
  collectionName?: string;
  page?: number;
  offset?: number;
}

export async function collectionAccountsService(
  chainKey: string,
  { collectionName, page, offset }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
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
