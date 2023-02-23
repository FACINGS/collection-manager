import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface CollectionProps {
  contract?: string;
  collection_name?: string;
  name?: string;
  img?: string;
  author?: string;
  allow_notify?: boolean;
  authorized_accounts?: string[];
  notify_accounts?: string[];
  market_fee?: number;
  data?: {
    img?: string;
    url?: string;
    name?: string;
    socials?: string;
    description?: string;
    creator_info?: string;
  };
  created_at_time?: string;
  created_at_block?: string;
}

interface ParamsProps {
  collectionName: string;
}

interface DataProps {
  data: CollectionProps;
}

export async function getCollectionService(
  chainKey: string,
  { collectionName }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/collections/${collectionName}`;

  const response = await api.get(url);

  return response;
}
