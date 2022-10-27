import * as chainsConfig from '@configs/chainsConfig';

export function isValidChainKey(chainKey) {
  const chainsKeys = Object.keys(chainsConfig);
  return chainsKeys.includes(chainKey);
}
