import 'regenerator-runtime/runtime';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { TopAppBar } from '@components/TopAppBar';
import { Footer } from '@components/Footer';
import type { AppProps } from 'next/app';

import { appName, chainKeyDefault } from '@configs/globalsConfig';
import '@utils/yupMethods';

import chainsConfig from '@configs/chainsConfig';

import '@styles/globals.css';
import { UALWrapper } from '@components/UALWrapper';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const chainId = (chainsConfig[`${router.query.chainKey}`]?.chainId ??
    chainsConfig[chainKeyDefault].chainId) as string;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <UALWrapper appName={appName} chainId={chainId}>
        <TopAppBar />
        <Component key={router.asPath} {...pageProps} />
        <Footer />
      </UALWrapper>
    </>
  );
}
