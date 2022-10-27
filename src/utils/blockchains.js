import * as chains from '@configs/chainsConfig';

export const blockchains = Object.keys(chains).map((chainKey) => {
  const { chainId, name, protocol, host, port } = chains[chainKey];

  return {
    chainId,
    name,
    rpcEndpoints: [
      {
        protocol,
        host,
        port,
      },
    ],
  };
});
