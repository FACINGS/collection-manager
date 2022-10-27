import { api } from '@libs/api';
import * as chainsConfig from '@configs/chainsConfig';

export async function getSchemaService(
  chainKey,
  { collectionName, schemaName }
) {
  const url = `${chainsConfig[chainKey].aaEndpoint}/atomicassets/v1/schemas/${collectionName}/${schemaName}`;

  const response = await api.get(url);

  return response;
}
