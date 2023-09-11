import { api } from '@libs/api';
import chainsConfig from '@configs/chainsConfig';
import { AxiosResponse } from 'axios';

export interface StatsProps {
  assets: number;
  burned: number;
  burned_by_template: {
    burned: number;
    template_id: number;
  }[];
  burned_by_schema: {
    burned: number;
    schema_name: string;
  }[];
  templates: number;
  schemas: number;
}

interface ParamsProps {
  collectionName: string;
}

interface DataProps {
  data: StatsProps;
}

export async function collectionStatsService(
  chainKey: string,
  { collectionName }: ParamsProps
): Promise<AxiosResponse<DataProps>> {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/collections/${collectionName}/stats`;

  const response = await api.get(url);

  return response;
}
