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
            <h2 className="headline-2 mb-2">NFT Manager</h2>
            <p className="body-1 text-neutral-200 mb-2">
              Creators can easily create and manage their NFT collections.
              Regular users can also benefit from the NFT Manager by making use
              of other provided tools:
            </p>
            <ol className="list-decimal pl-6 body-1 text-neutral-200">
              <li className="pl-1">Airdrop NFTs</li>
              <li className="pl-1">Burn NFTs</li>
              <li className="pl-1">Cancel Sales</li>
              <li className="pl-1">Create Sales</li>
              <li className="pl-1">Transfer NFTs</li>
            </ol>
            <br />
            <p className="body-1 text-neutral-200 mb-2">
              NFT Manager is a fork of the reference UI implementation that has
              originally been built by FACINGS and funded by the EOS Network
              Foundation.
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
              (this project)
              <br />
              <a
                href="https://github.com/FACINGS/collection-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://github.com/FACINGS/collection-manager
              </a>{' '}
              (original)
              <br />
              <a
                href="https://github.com/Jackthegr8at/nfts_platform"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                https://github.com/Jackthegr8at/nfts_platform
              </a>{' '}
              (some tool logic that has been adapted)
            </p>
          </section>

          <section className="my-8 md:my-12 lg:my-16">
            <h2 className="headline-2 mb-2">AtomicAssets</h2>
            <p className="body-1 text-neutral-200">
              <a
                href="https://github.com/pinknetworkx/atomicassets-contract"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                AtomicAssets
              </a>{' '}
              is a Non-Fungible Token (NFT) standard for{' '}
              <a
                href="https://antelope.io"
                target="_blank"
                rel="noreferrer"
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
            <h2 className="headline-2 mb-2">Soon.Market</h2>
            <p className="body-1 text-neutral-200">
              <a
                href="https://soon.market?utm_medium=about&utm_source=nft-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Soon.Market
              </a>{' '}
              is the leading NFT marketplace on XPR Network and currently does
              not allow to manage NFT collections. Therefore, this application
              was forked in order to provide creators the possibility to easily
              create and manage their NFT collections.
            </p>
          </section>

          <section className="my-8 md:my-12 lg:my-16">
            <h2 className="headline-2 mb-2">kryptokrauts</h2>
            <p className="body-1 text-neutral-200 mb-2">
              <a
                href="https://kryptokrauts.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                kryptokrauts
              </a>{' '}
              have been around in the crypto community since 2017 and are
              winners of several hackathons.
              <br />
              <br />
              Currently, the team is focusing on building{' '}
              <a
                href="https://soon.market?utm_medium=about&utm_source=nft-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Soon.Market
              </a>{' '}
              - the leading NFT marketplace on XPR Network!
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
