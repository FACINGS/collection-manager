# NFT Collection Manager

An NFT Collection Manager for the EOS/AtomicAssets ecosystem built by [FACINGS](https://facings.io) as per our [ENF Grant Proposal](https://github.com/eosnetworkfoundation/grant-framework/blob/main/applications/facings-nft-collection-manager.md).

## Dependencies

1. Public AtomicAsset API ([AGPLv3](https://github.com/pinknetworkx/eosio-contract-api); use any [public endpoint](https://support.pink.gg/hc/en-us/articles/4405478859922-Developer-Resources))
2. Public Node API endpoint ([MIT](https://github.com/EOSIO/eos); use any public [EOS](https://mainnet.eosio.online/endpoints) or [WAX](https://wax.eosio.online/endpoints) endpoint)
3. Public IPFS endpoint ([MIT](https://github.com/ipfs/ipfs); e.g. https://ipfs.ledgerwise.io/ipfs)

## Getting Started - Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

## Running the application with docker

Install Docker and execute:

```
docker-compose up --build --force-recreate .
```

After build, open [http://localhost:3000](http://localhost:3000) to access the app.

## License

GPLv3
