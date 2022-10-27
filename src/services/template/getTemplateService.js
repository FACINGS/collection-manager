import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getTemplateService(
  chainKey,
  { collectionName, templateId }
) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/templates/${collectionName}/${templateId}`;

  const response = await api.get(url);

  return response;
}
