import chainsConfig from '@configs/chainsConfig';

interface BlockchainsProps {
  chainId: string;
  name: string;
  protocol: string;
  host: string;
  port: string;
}

export const blockchains = Object.keys(chainsConfig).map((chainKey) => {
  const { chainId, name, protocol, host, port }: BlockchainsProps =
    chainsConfig[chainKey];

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
