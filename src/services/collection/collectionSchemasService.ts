import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface SchemaProps {
  contract: string;
  schema_name: string;
  format: {
    name: string;
    type: string;
  }[];
  collection: {
    collection_name: string;
    name: string;
    img: string;
    author: string;
    allow_notify: boolean;
    authorized_accounts: string[];
    notify_accounts: string[];
    market_fee: number;
    created_at_block: string;
    created_at_time: string;
  };
  created_at_time: string;
  created_at_block: string;
}

interface DataProps {
  data: SchemaProps[];
}

interface ParamsProps {
  collectionName?: string;
  page?: number;
  offset?: number;
}

export async function collectionSchemasService(
  chainKey: string,
  { collectionName, page, offset }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
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
