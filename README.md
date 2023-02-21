# NFT Collection Manager

An NFT Collection Manager for the EOS/AtomicAssets ecosystem built by [FACINGS](https://facings.io) as per our [ENF Grant Proposal](https://github.com/eosnetworkfoundation/grant-framework/blob/main/applications/facings-nft-collection-manager.md).

This project is meant to both work as a stand-alone NFT publishing platform, as well as a launchpad for NFT developers on EOS.

The core feature set is very simple:

1. Login and view resource usage
2. View/explore collections (schemas, templates, and assets)
3. Create and edit collections

Important principles:

1. Keep the core simple and secure with minimal dependencies
2. Allow publishers, developers, and businesses to build faster
3. Grow open-source community around core EOS/AtomicAssets needs

## Dependencies

1. Public AtomicAsset API ([AGPLv3](https://github.com/pinknetworkx/eosio-contract-api); use any [public endpoint](https://support.pink.gg/hc/en-us/articles/4405478859922-Developer-Resources))
2. Public Node API endpoint ([MIT](https://github.com/EOSIO/eos); use any public [EOS](https://mainnet.eosio.online/endpoints) or [WAX](https://wax.eosio.online/endpoints) endpoint)
3. Public IPFS endpoint ([MIT](https://github.com/ipfs/ipfs); e.g. https://ipfs.ledgerwise.io/ipfs)

## Getting Started - Development

Ensure all project dependencies are installed:

```bash
yarn
```

The following command will prep the environment, and, using the API endpoints
specified in `.env.development`, start the application server in development
mode with features like hot-code reloading and dev-friendly error reporting.

```bash
yarn dev
```

Now you may open [http://localhost:3000](http://localhost:3000) to access the app.

## Running the application with docker

Install Docker and execute:

```
docker-compose up --build --force-recreate
```

After build, open [http://localhost:3000](http://localhost:3000) to access the app.

## Environment Variables

Next.js allows you to set defaults in `.env` (all environments),
`.env.development` (development environment), and
`.env.production` (production environment).

Variables set in `.env.local` always override any defaults set.

## Testnet

There are not yet any public AA endpoints for the EOS testnet. If you do not
want to publish on EOS mainnet, you may try on WAX. To do so, you should enable
chain selection at your `.env.local` file and change the AA endpoint to
`https://aawt.facings.waxpub.net`.

## License

GPLv3
