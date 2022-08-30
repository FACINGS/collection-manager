module.exports = {
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  aaEndpoint: process.env.NEXT_PUBLIC_AA_ENDPOINT,
  ipfsEndpoint: process.env.NEXT_PUBLIC_IPFS_ENDPOINT,
  enableChainSelection:
    process.env.NEXT_PUBLIC_ENABLE_CHAIN_SELECTION === 'true',
};
