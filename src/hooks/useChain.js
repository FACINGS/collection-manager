import { ChainContext } from '@contexts/ChainContext';
import { useContext } from 'react';

export function useChain() {
  return useContext(ChainContext);
}
