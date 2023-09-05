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

interface ParamsProps {
  collectionName: string;
  schemaName: string;
}

interface DataProps {
  data: SchemaProps;
}

export async function getSchemaService(
  chainKey: string,
  { collectionName, schemaName }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/schemas/${collectionName}/${schemaName}`;

  const response = await api.get(url);

  return response;
}
