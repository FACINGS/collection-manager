import { WebAuth } from '@proton/ual-webauth';
import { Anchor } from 'ual-anchor';

export default {
  xpr: {
    name: 'XPR Network',
    imageUrl: '/xprnetwork.png',
    authenticators: [WebAuth, Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_XPR_NETWORK_MAINNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_XPR_NETWORK_MAINNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_XPR_NETWORK_MAINNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_XPR_NETWORK_MAINNET_HOST,
    port: process.env.NEXT_PUBLIC_XPR_NETWORK_MAINNET_PORT,
  },
  'xpr-test': {
    name: 'XPR Network (Testnet)',
    imageUrl: '/xprnetwork.png',
    authenticators: [WebAuth, Anchor],
    aaEndpoint: process.env.NEXT_PUBLIC_XPR_NETWORK_TESTNET_AA_ENDPOINT,
    chainId: process.env.NEXT_PUBLIC_XPR_NETWORK_TESTNET_CHAIN_ID,
    protocol: process.env.NEXT_PUBLIC_XPR_NETWORK_TESTNET_PROTOCOL,
    host: process.env.NEXT_PUBLIC_XPR_NETWORK_TESTNET_HOST,
    port: process.env.NEXT_PUBLIC_XPR_NETWORK_TESTNET_PORT,
  },
};
