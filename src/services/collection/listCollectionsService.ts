import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

interface OptionsProps {
  page?: number;
  offset?: number;
  author?: string;
  match?: string;
  limit?: number;
}

export interface CollectionProps {
  contract: string;
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  data: {
    img: string;
    url: string;
    name: string;
    images: string;
    socials: string;
    creator_info: string;
  };
  created_at_time: string;
  created_at_block: string;
}

interface DataProps {
  data: CollectionProps[];
}

export const listCollectionsService = async (
  chainKey: string,
  options: OptionsProps
): Promise<AxiosResponse<DataProps>> => {
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
};
