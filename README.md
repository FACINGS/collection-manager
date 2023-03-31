# NFT Collection Manager

An NFT Collection Manager for the EOS/AtomicAssets ecosystem built by [FACINGS](https://facings.io) as per our [ENF Grant Proposal](https://github.com/eosnetworkfoundation/grant-framework/blob/main/applications/facings-nft-collection-manager.md).

This project is meant to both work as a stand-alone NFT publishing platform, as well as a launchpad for NFT developers on EOS.


The core feature set is very simple:

1. Login and view resource usage
2. View/explore collections (schemas, templates, and NFTs)
3. Create and edit collections
4. Mint and transfer NFTs

Important principles:

1. Keep the core simple and secure with minimal dependencies
2. Allow publishers, developers, and businesses to build faster
3. Grow open-source community around core EOS/AtomicAssets needs


## Documentation

1. **Getting Started** (this README document) - Project overview and "Getting Started" guide for devs.
2. **[User Guide](docs/user-guide.md)** - For users. Basic tutorial explaining how to create a collection and mint NFTs.
3. **[Plugin System](docs/plugins.md)** - For devs, describing how the plugin system works.
4. **[Contributing](CONTRIBUTING.md)** - For devs, describing how to contribute to this project.
5. **[Testing Guide](docs/testing-guide.md)** - For reviewers/testers, full run-through of functionality.
6. **[Data Import Plugin](docs/plugin-import.md)** - For users, guide to using the CSV import plugin.
7. **[Data Types](docs/data-types.md)** - An overview of AtomicAssets data types.


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
specified in `.env`, start the application server in development
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

If you do not wish to publish on EOS mainnet, you may select the "Jungle4 (EOS Testnet)" chain in the upper left-hand corner.

Currently this app supports both [EOS Jungle4 Testnet](https://eosinabox.com/) and [WAX Testnet](https://waxsweden.org/create-testnet-account/). (Click either link to create a free testnet account.)

## License

GPLv3
