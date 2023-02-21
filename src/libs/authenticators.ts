import { appName } from '@configs/globalsConfig';
import * as chainsConfig from '@configs/chainsConfig';
import { blockchains } from '@utils/blockchains';

export const authenticators = Object.keys(chainsConfig).reduce(
  (accumulator, chainKey) => {
    const { authenticators, chainId } = chainsConfig[chainKey];
    const blockchain = blockchains.find(
      (blockchain) => blockchain.chainId === chainId
    );

    return {
      ...accumulator,
      [chainId]: authenticators.map(
        (Authenticator) =>
          new Authenticator([blockchain], {
            appName,
            disableGreymassFuel: true,
          })
      ),
    };
  },
  {}
);
