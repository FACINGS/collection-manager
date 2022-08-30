const eosChain = {
  chainId: process.env.NEXT_PUBLIC_EOS_CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: process.env.NEXT_PUBLIC_EOS_PROTOCOL,
      host: process.env.NEXT_PUBLIC_EOS_HOST,
      port: process.env.NEXT_PUBLIC_EOS_PORT,
    },
  ],
};

export default eosChain;
