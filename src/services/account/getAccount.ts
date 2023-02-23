import { JsonRpc } from 'eosjs';
import chainsConfig from '@configs/chainsConfig';

interface AccountNameProps {
  accountName: string;
}

export async function getAccount(
  chainKey: string,
  { accountName }: AccountNameProps
) {
  const rpcEndpoint = `${chainsConfig[chainKey].protocol}://${chainsConfig[chainKey].host}`;

  const rpc = new JsonRpc(rpcEndpoint, { fetch });
  const response = await rpc.get_account(accountName);

  return response;
}
