import Head from 'next/head';
import { appName } from '@configs/globalsConfig';

export default function About() {
  return (
    <>
      <Head>
        <title>{`About - ${appName}`}</title>
      </Head>

      <main className="container">
        <article className="max-w-3xl w-full mx-auto">
          <header className="mt-8 md:mt-12 lg:mt-16">
            <h1 className="headline-1 mb-2">About</h1>
          </header>

          <section className="mt-8 md:mt-12 lg:mt-16">
            <h2 className="headline-2 mb-2">Purpose</h2>
            <p className="body-1 text-neutral-200 mb-2">
              NFT Manager is a fork of the reference UI implementation that has
              originally been built by FACINGS and funded by the EOS Network
              Foundation.
              <br />
              <br />
              <a
                href="https://soon.market?utm_medium=about&utm_source=nft-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Soon.Market
              </a>{' '}
              is the leading NFT marketplace on XPR Network and currently does not allow to manage NFT collections.
              Therefore, this application was forked in order to provide creators
              the possibility to easily create and manage their NFT collections.
              <br />
              <br />
              Creators and regular users can also benefit from the NFT Manager
              by making use of other provided tools:
              <ol className="list-decimal pl-6 body-1 text-neutral-200">
                <li className="pl-1">Airdrop NFTs</li>
                <li className="pl-1">Burn NFTs</li>
                <li className="pl-1">Cancel Sales</li>
                <li className="pl-1">Transfer NFTs</li>
              </ol>
            </p>

            <h3 className="title-1 mt-4 md:mt-8 mb-1">Source Code</h3>
            <p className="body-1 text-neutral-200">
              <a
                href="https://github.com/kryptokrauts/nft-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://github.com/kryptokrauts/nft-manager
              </a>{' '}
              forked from{' '}
              <a
                href="https://github.com/FACINGS/collection-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://github.com/FACINGS/collection-manager
              </a>
            </p>
          </section>

          <section className="my-8 md:my-12 lg:my-16">
            <h2 className="headline-2 mb-2">About AtomicAssets</h2>
            <p className="body-1 text-neutral-200">
              <a
                href="https://github.com/pinknetworkx/atomicassets-contract"
                target="_blank"
                className="underline"
              >
                AtomicAssets
              </a>{' '}
              is a Non-Fungible Token (NFT) standard for{' '}
              <a
                href="https://antelope.io"
                target="_blank"
                className="underline"
              >
                Antelope
              </a>{' '}
              blockchains. AtomicAsset NFTs are resource-efficient yet
              full-featured. All metadata is stored on-chain, and templates are
              used to efficiently store redundant data. Additional features
              include native trade offer functionality and on-chain
              notifications.
            </p>
          </section>

          <section className="my-8 md:my-12 lg:my-16">
            <h2 className="headline-2 mb-2">About kryptokrauts</h2>
            <p className="body-1 text-neutral-200 mb-2">
              We have been around in the crypto community since 2017 and we are
              winners of several hackathons.
              <br />
              <br />
              Currently, we are focusing on building{' '}
              <a
                href="https://soon.market?utm_medium=about&utm_source=nft-manager"
                target="_blank"
                className="underline"
              >
                Soon.Market
              </a>{' '}
              - the leading NFT marketplace on XPR Network!
            </p>
            <p className="body-1 text-neutral-200">
              <a
                href="https://kryptokrauts.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://kryptokrauts.com
              </a>
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
