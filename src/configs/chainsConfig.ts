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
  jungle4: {
    name: 'Jungle4 (EOS Testnet)',
    imageUrl: 'https://bloks.io/img/chains/jungle.png',
    authenticators: [Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_EOS_JUNGLE4_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_EOS_JUNGLE4_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_EOS_JUNGLE4_PROTOCOL,
    host: process.env.NEXT_PUBLIC_EOS_JUNGLE4_HOST,
    port: process.env.NEXT_PUBLIC_EOS_JUNGLE4_PORT,
  },
};
