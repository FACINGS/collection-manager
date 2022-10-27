import 'regenerator-runtime/runtime';

import { useRouter } from 'next/router';
import { UALProvider } from 'ual-reactjs-renderer';

import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

import { appName, chainKeyDefault } from '@configs/globalsConfig';
import { authenticators } from '@libs/authenticators';
import { blockchains } from '@utils/blockchains';
import '@utils/yupMethods';

import * as chainsConfig from '@configs/chainsConfig';

import '@styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const chainId =
    chainsConfig[router.query.chainKey]?.chainId ??
    chainsConfig[chainKeyDefault].chainId;

  return (
    <UALProvider
      appName={appName}
      authenticators={authenticators[chainId]}
      chains={blockchains}
      key={chainId}
    >
      <Header />
      <Component key={router.asPath} {...pageProps} />
      <Footer />
    </UALProvider>
  );
}
