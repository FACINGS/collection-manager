import { JsonRpc } from 'eosjs';
import eosChain from '@configs/eosChainConfig';

const eos = new JsonRpc(
  `${eosChain.rpcEndpoints[0].protocol}://${eosChain.rpcEndpoints[0].host}`,
  { fetch }
);

export async function getEosAccountInfo(
  activeUser,
  onInfoResponse = () => {},
  error = () => {}
) {
  try {
    const response = await eos.get_account(activeUser.accountName);

    const data = {
      cpu: {
        max: parseInt(response.cpu_limit.max),
        used: parseInt(response.cpu_limit.used),
        available: parseInt(response.cpu_limit.available),
      },
      net: {
        max: parseInt(response.net_limit.max),
        used: parseInt(response.net_limit.used),
        available: parseInt(response.net_limit.available),
      },
      ram: {
        quota: parseInt(response.ram_quota),
        used: parseInt(response.ram_usage),
      },
    };

    onInfoResponse(data);
  } catch (e) {
    console.error(e);
    error(e.message);
  }
}
