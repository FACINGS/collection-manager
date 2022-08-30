import { Anchor } from 'ual-anchor';
import { Wax } from '@alienworlds/ual-wax';
import waxChain from '@configs/waxChainConfig';
import eosChain from '@configs/eosChainConfig';
import { appName } from '@configs/globalsConfig';

const chains = {
  wax: {
    chain: [waxChain],
    authenticators: [
      new Anchor([waxChain], { appName }),
      new Wax([waxChain], { appName }),
    ],
  },
  eos: {
    chain: [eosChain],
    authenticators: [new Anchor([eosChain], { appName })],
  },
};

export default chains;
