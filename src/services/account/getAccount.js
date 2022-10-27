import { JsonRpc } from 'eosjs';
import * as chainsConfig from '@configs/chainsConfig';

export async function getAccount(chainKey, { accountName }) {
  const rpcEndpoint = `${chainsConfig[chainKey].protocol}://${chainsConfig[chainKey].host}`;

  const rpc = new JsonRpc(rpcEndpoint, { fetch });
  const response = await rpc.get_account(accountName);

  return response;
}
