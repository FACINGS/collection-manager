export default function About() {
  return (
    <main className="container">
      <article className="max-w-3xl w-full mx-auto">
        <header className="mt-8 md:mt-12 lg:mt-16">
          <h1 className="headline-1 mb-2">About</h1>
        </header>

        <section className="mt-8 md:mt-12 lg:mt-16">
          <h2 className="headline-2 mb-2">Purpose</h2>
          <p className="body-1 text-neutral-200 mb-2">
            Collection Manager is a reference UI implementation showcasing
            AtomicAssets functionality, built by FACINGS and funded by the EOS
            Network Foundation.
          </p>
          <p className="body-1 text-neutral-200">
            It's meant to work as both a stand-alone tool for collection owners,
            as well as a starting point for NFT developers making their own apps
            on Antelope. Collection Manager can be forked and customized to suit
            the needs of your own project.
          </p>

          <h3 className="title-1 mt-4 md:mt-8 mb-1">Source Code</h3>
          <p className="body-1 text-neutral-200">
            Github:{' '}
            <a
              href="https://linktr.ee/FACINGSOfficial"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              https://github.com/FACINGS/collection-manager
            </a>
          </p>

          <h3 className="title-1 mt-4 md:mt-8 mb-1">Design principles</h3>
          <ol className="list-decimal pl-6 body-1 text-neutral-200">
            <li className="pl-1">
              Keep the core simple and secure with minimal dependencies
            </li>
            <li className="pl-1">
              Help publishers, developers, and businesses ship faster
            </li>
            <li className="pl-1">
              Grow open-source community around core EOS/AtomicAssets needs
            </li>
          </ol>

          <h3 className="title-1 mt-4 md:mt-8 mb-1">Core features</h3>
          <ol className="list-decimal pl-6 body-1 text-neutral-200">
            <li className="pl-1">Login and view resource usage</li>
            <li className="pl-1">
              View/explore collections (schemas, templates, and assets)
            </li>
            <li className="pl-1">Create and edit collections</li>
          </ol>
        </section>

        <section className="my-8 md:my-12 lg:my-16">
          <h2 className="headline-2 mb-2">About AtomicAssets</h2>
          <p className="body-1 text-neutral-200">
            AtomicAssets is a Non-Fungible Token (NFT) standard for Antelope
            blockchains. AtomicAsset NFTs are resource-efficient yet
            full-featured. All metadata is stored on-chain, and templates are
            used to efficiently store redundant data. Additional features
            include native trade offer functionality and on-chain notifications.
          </p>
        </section>

        <section className="my-8 md:my-12 lg:my-16">
          <h2 className="headline-2 mb-2">About FACINGS</h2>
          <p className="body-1 text-neutral-200 mb-2">
            FACINGS aims to unlock the value of web3 for the masses by making
            distribution of engaging NFTs easy, affordable, and scalable. We
            serve those who aspire to launch NFTs, saving them time and money by
            providing flexible tools to model and publish high-quality,
            feature-rich NFT collections. Using FACINGS, NFT publishers can take
            their concept to market quickly and reach their audience, wherever
            they are.
          </p>
          <p className="body-1 text-neutral-200">
            Social links:{' '}
            <a
              href="https://linktr.ee/FACINGSOfficial"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              https://linktr.ee/FACINGSOfficial
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
