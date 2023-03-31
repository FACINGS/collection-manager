import 'regenerator-runtime/runtime';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { UALProvider } from 'ual-reactjs-renderer';

import { TopAppBar } from '@components/TopAppBar';
import { Footer } from '@components/Footer';
import type { AppProps } from 'next/app';

import { appName, chainKeyDefault } from '@configs/globalsConfig';
import { authenticators } from '@libs/authenticators';
import { blockchains } from '@utils/blockchains';
import '@utils/yupMethods';

import * as chainsConfig from '@configs/chainsConfig';

import '@styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const chainId = (chainsConfig[`${router.query.chainKey}`]?.chainId ??
    chainsConfig[chainKeyDefault].chainId) as string;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <UALProvider
        appName={appName}
        authenticators={authenticators[chainId]}
        chains={blockchains}
        key={chainId}
      >
        <TopAppBar />
        <Component key={router.asPath} {...pageProps} />
        <Footer />
      </UALProvider>
    </>
  );
}
