import * as waxjs from '@waxio/waxjs/dist';
import waxChain from '@configs/waxChainConfig';

const wax = new waxjs.WaxJS({
  rpcEndpoint: `${waxChain.rpcEndpoints[0].protocol}://${waxChain.rpcEndpoints[0].host}`,
});

export async function getWaxAccountInfo(
  activeUser,
  onInfoResponse = () => {},
  error = () => {}
) {
  try {
    const response = await wax.rpc.get_account(activeUser.accountName);

    const data = {
      waxAvailable: response.core_liquid_balance
        ? response.core_liquid_balance
        : '0.00000000 WAX',
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
