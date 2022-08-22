const waxChain = {
    chainId: process.env.NEXT_PUBLIC_WAX_CHAIN_ID,
    rpcEndpoints: [{
        protocol: process.env.NEXT_PUBLIC_WAX_PROTOCOL,
        host: process.env.NEXT_PUBLIC_WAX_HOST,
        port: process.env.NEXT_PUBLIC_WAX_PORT
    }]
};

export default waxChain;