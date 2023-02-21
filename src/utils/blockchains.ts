import * as chains from '@configs/chainsConfig';

interface BlockchainsProps {
  chainId: string;
  name: string;
  protocol: string;
  host: string;
  port: string;
}

export const blockchains = Object.keys(chains).map((chainKey) => {
  const { chainId, name, protocol, host, port }: BlockchainsProps =
    chains[chainKey];

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
