import chainsConfig from '@configs/chainsConfig';

export function getChainKeyByChainId(chainId: string) {
  const chainsKeys = Object.keys(chainsConfig);

  const chainKeyDefaultIndex = chainsKeys.findIndex((chainKey) => {
    return chainsConfig[chainKey].chainId === chainId;
  });
  const chainKey = chainsKeys[chainKeyDefaultIndex];

  return chainKey;
}
