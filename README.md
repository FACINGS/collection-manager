# NFT Collection Manager

An NFT Collection Manager for the EOS/AtomicAssets ecosystem built by [FACINGS](https://facings.io) as per our [ENF Grant Proposal](https://github.com/eosnetworkfoundation/grant-framework/blob/main/applications/facings-nft-collection-manager.md).


## Dependencies

1. Public AtomicAsset API ([AGPLv3](https://github.com/pinknetworkx/eosio-contract-api); use any [public endpoint](https://support.pink.gg/hc/en-us/articles/4405478859922-Developer-Resources))
2. Public Node API endpoint ([MIT](https://github.com/EOSIO/eos); use any public [EOS](https://mainnet.eosio.online/endpoints) or [WAX](https://wax.eosio.online/endpoints) endpoint)
3. Public IPFS endpoint ([MIT](https://github.com/ipfs/ipfs); e.g. https://ipfs.ledgerwise.io/ipfs)


## FACINGS Internal Reference

1. Internal / [Live Demo](https://collectionmanager.test.facings.io/) (*collectionmanager.test.facings.io*)
1. Internal / [Spec Document](https://docs.google.com/document/d/1on1URa9n8XgbPNvYrYOk5uHNXFy439MxaxpajfC_npE/edit?pli=1) (*docs.google.com*)
1. Internal / [Project Tracker](https://facings.sharepoint.com/:x:/r/sites/FACINGS/_layouts/15/Doc.aspx?sourcedoc=%7BB084D27B-B682-46BF-AA75-0FC511DC77BA%7D&file=NFT%20Manager%20UI%20(ENF).xlsx) (*facings.sharepoint.com*)
1. Internal / [Wireframes](https://wireframepro.mockflow.com/#/space/MI923fedBh) (mockflow.com)

Private AA endpoint: https://aawt.facings.waxpub.net/docs/

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


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
