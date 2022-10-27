import { Anchor } from 'ual-anchor';
import { Wax } from '@alienworlds/ual-wax';

module.exports = {
  eos: {
    name: 'EOS',
    imageUrl: 'https://bloks.io/img/chains/eos.png',
    authenticators: [Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_EOS_MAINNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_EOS_MAINNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_EOS_MAINNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_EOS_MAINNET_HOST,
    port: process.env.NEXT_PUBLIC_EOS_MAINNET_PORT,
  },

  wax: {
    name: 'WAX',
    imageUrl: 'https://wax.bloks.io/img/chains/wax.png',
    authenticators: [Anchor, Wax],
    aaEndpoint: process.env.NEXT_PUBLIC_WAX_MAINNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_WAX_MAINNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_WAX_MAINNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_WAX_MAINNET_HOST,
    port: process.env.NEXT_PUBLIC_WAX_MAINNET_PORT,
  },

  'wax-test': {
    name: 'WAX (Testnet)',
    imageUrl: 'https://wax.bloks.io/img/chains/wax.png',
    authenticators: [Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_WAX_TESTNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_WAX_TESTNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_WAX_TESTNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_WAX_TESTNET_HOST,
    port: process.env.NEXT_PUBLIC_WAX_TESTNET_PORT,
  },
  /*
  // Disabled -- as of Sept 2022 there is no public AA endpoint for testnet
  jungle3: {
    name: 'Jungle (EOS Testnet / experimental)',
    imageUrl: 'https://bloks.io/img/chains/jungle.png',
    authenticators: [Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_EOS_JUNGLE3_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_EOS_JUNGLE3_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_EOS_JUNGLE3_PROTOCOL,
    host: process.env.NEXT_PUBLIC_EOS_JUNGLE3_HOST,
    port: process.env.NEXT_PUBLIC_EOS_JUNGLE3_PORT,
  },
*/
};
