import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface TemplateProps {
  contract: string;
  template_id: string;
  is_transferable: boolean;
  is_burnable: boolean;
  issued_supply: string;
  max_supply: string;
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
  schema: {
    schema_name: string;
    format: {
      name: string;
      type: string;
    }[];
    created_at_block: string;
    created_at_time: string;
  };
  immutable_data: {
    [key: string]: string;
  };
  created_at_time: string;
  created_at_block: string;
  name: string;
}

interface DataProps {
  data: TemplateProps[];
}

interface ParamsProps {
  collectionName?: string;
  page?: number;
  offset?: number;
  limit?: number;
  schemaName?: string;
  templateId?: string;
}

export async function collectionTemplatesService(
  chainKey: string,
  { collectionName, page, offset, templateId }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/templates`;

  const response = await api.get(url, {
    params: {
      collection_name: collectionName || '',
      template_id: templateId || '',
      page: page || 1,
      limit: 12,
      offset: offset || 12,
      order: 'desc',
      sort: 'created',
    },
  });

  return response;
}
