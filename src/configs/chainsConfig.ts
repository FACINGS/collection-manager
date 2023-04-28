import { Anchor } from 'ual-anchor';
import { Wax } from '@eosdacio/ual-wax';
import { WebAuth } from '@proton/ual-webauth';

export default {
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
  proton: {
    name: 'Proton',
    imageUrl: 'https://proton.bloks.io/img/chains/proton.png',
    authenticators: [WebAuth, Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_PROTON_MAINNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_PROTON_MAINNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_PROTON_MAINNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_PROTON_MAINNET_HOST,
    port: process.env.NEXT_PUBLIC_PROTON_MAINNET_PORT,
  },
  'proton-test': {
    name: 'Proton (Testnet)',
    imageUrl: 'https://proton.bloks.io/img/chains/proton.png',
    authenticators: [WebAuth, Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_PROTON_TESTNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_PROTON_TESTNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_PROTON_TESTNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_PROTON_TESTNET_HOST,
    port: process.env.NEXT_PUBLIC_PROTON_TESTNET_PORT,  
  }
};
