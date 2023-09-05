import chainsConfig from '@configs/chainsConfig';

export function isValidChainKey(chainKey: string) {
  const chainsKeys = Object.keys(chainsConfig);
  return chainsKeys.includes(chainKey);
}
