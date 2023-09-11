'use client';

import { UALProvider } from 'ual-reactjs-renderer';
import { authenticators } from '@libs/authenticators';
import { blockchains } from '@utils/blockchains';

interface UALWrapperProps {
  appName: string;
  chainId: string;
  children: React.ReactNode;
}

export function UALWrapper({ appName, chainId, children }: UALWrapperProps) {
  return (
    <UALProvider
      appName={appName}
      authenticators={authenticators[chainId]}
      chains={blockchains}
      key={chainId}
    >
      {children}
    </UALProvider>
  );
}
