import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface AssetProps {
  contract: string;
  asset_id: string;
  owner: string;
  is_transferable: boolean;
  is_burnable: boolean;
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
  template: {
    template_id: string;
    max_supply: string;
    is_transferable: boolean;
    is_burnable: boolean;
    issued_supply: string;
    immutable_data: {
      [key: string]: any;
    }[];
    created_at_time: string;
    created_at_block: string;
  };
  mutable_data: {
    [key: string]: any;
  }[];
  immutable_data: {
    [key: string]: any;
  }[];
  template_mint: string;
  backed_tokens: any[];
  burned_by_account: string;
  burned_at_block: string;
  burned_at_time: string;
  updated_at_block: string;
  updated_at_time: string;
  transferred_at_block: string;
  transferred_at_time: string;
  minted_at_block: string;
  minted_at_time: string;
  data: {
    [key: string]: any;
  }[];
  name: string;
}

interface DataProps {
  data: AssetProps[];
}

export async function getInventoryService(
  chainKey,
  options
): Promise<AxiosResponse<DataProps>> {
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
