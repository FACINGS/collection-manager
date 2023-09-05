import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface AccountStatsProps {
  data: {
    success: boolean;
    data: {
      collections: {
        collection: {
          contract: string;
          collection_name: string;
          name: string;
          img?: string;
          author: string;
          allow_notify: boolean;
          authorized_accounts: string[];
          notify_accounts: string[];
          market_fee: number;
          data: {
            img?: string;
            url: string;
            name: string;
            description: string;
            images?: string;
            socials?: string;
            creator_info?: string;
          };
          created_at_time: string;
          created_at_block: string;
        };
        assets: string;
      }[];
      templates: {
        collection_name: string;
        template_id: string;
        assets: string;
      }[];
      assets: string;
    };
    query_time: number;
  };
  status: number;
  statusText: string;
  headers: {
    'content-length': string;
    'content-type': string;
    'last-modified': string;
  };
  config: {
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: {};
    headers: {
      Accept: string;
      Referer: string;
    };
    method: string;
    url: string;
  };
  request: {};
}

interface DataProps {
  data: AccountStatsProps;
}

export async function getAccountStatsService(
  chainKey: string,
  accountName: string
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/accounts/${accountName}`;

  const response = await api.get(url);

  return response;
}
