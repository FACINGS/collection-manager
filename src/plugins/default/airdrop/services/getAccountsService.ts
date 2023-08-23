import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

interface DataProps {
  data: any;
}

interface ParamsProps {
  page?: number;
  limit?: number;
  owner?: string;
  schemaName?: string;
  templateID?: string;
  collectionName?: string;
}

export async function getAccountsService(
  chainKey: string,
  { collectionName, schemaName, templateID, page, limit, owner }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/accounts`;

  const response = await api.get(url, {
    params: {
      collection_name: collectionName,
      schema_name: schemaName,
      template_id: templateID,
      owner,
      page: page || 1,
      limit: limit || 1000,
      order: 'desc',
      sort: 'asset_id',
    },
  });

  return response;
}
