import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface SaleProps {
  market_contract: string;
  assets_contract: string;
  sale_id: string;
  seller: string;
  buyer: string | null;
  offer_id: string;
  price: {
    token_contract: string;
    token_symbol: string;
    token_precision: number;
    median: null;
    amount: string;
  };
  listing_price: string;
  listing_symbol: string;
  assets: {
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
      };
      created_at_time: string;
      created_at_block: string;
    };
    mutable_data: {
      [key: string]: any;
    };
    immutable_data: {
      [key: string]: any;
    };
    template_mint: string;
    backed_tokens: any[];
    burned_by_account: string | null;
    burned_at_block: string | null;
    burned_at_time: string | null;
    updated_at_block: string;
    updated_at_time: string;
    transferred_at_block: string;
    transferred_at_time: string;
    minted_at_block: string;
    minted_at_time: string;
    data: {
      [key: string]: any;
    };
    name: string;
  }[];
  maker_marketplace: string;
  taker_marketplace: string | null;
  collection_name: string;
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
  is_seller_contract: boolean;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
  ordinality: string;
  state: number;
}

interface DataProps {
  data: SaleProps[];
}

export async function getSalesService(
  chainKey,
  options
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicmarket/v1/sales`;

  const {
    page = 1,
    offset = 0,
    owner,
    seller,
    collection_name,
    limit = 12,
  } = options;

  const params = {
    state: 1,
    owner,
    seller,
    collection_name,
    page,
    limit,
    offset,
    order: 'desc',
    sort: 'created',
  };

  const response = await api.get(url, {
    params,
  });

  return response;
}
