import eosChain from '@configs/eosChainConfig';
import waxChain from '@configs/waxChainConfig';

export function isWaxChain(chainId) {
    return chainId === waxChain.chainId;
}

export function isEosChain(chainId) {
    return chainId === eosChain.chainId;
}