# Airdrop Plugin

The airdrop plugin allows users to distribute NFTs in a number of ways.

Access the interface by clicking on "Plugins" in the header, then "Airdrop".

The two main portions of the form are (1) account selection and (2) NFT
selection. Both allow manual entry as well as queries.

## Account Selection

Accounts can be manually entered, or you may perform a query on AtomicAssets
holders.

### Querying Accounts

There are three options for querying holders:
1. Search by template - enter 1 or more template ids to retrieve a list of holders.
2. Search by collection - enter 1 or more collection names to retrieve a list of holders.
3. Search by not holding template - enter a collection and template id to
   retrieve a list of all accounts holding any NFT in this collection, excluding
   those which hold the specified template.

#### Unique Accounts

When "Unique accounts only" is selected, the query will not return duplicate accounts.

If this toggle is not selected:
1. When searching by a template, accounts holding multiple ("X") copies will be added "X" times.
2. When searching by multiple collections, accounts holding multiple collections will be added multiple times.

### Accounts to Airdrop

In addition to (or instead of) queries, you may manually specify (or append)
accounts here, separated by commas.

#### Randomizing Accounts

The dice button on the right side of this field will shuffle the listed accounts
using a seed obtained from random.org. Press it as many times as you like.


## NFT Selection

### Mint NFTs from template

This option allows you to specify a single template ID from which NFTs will be minted.

One NFT will be minted for each account specified.

### Transfer from NFT IDs

This option allows you to specify NFTs in your account you wish to airdrop to
the selected accounts. You may optionally query your holdings for a specific
template ID.

## Batch size

Batch size sets the number of accounts to reward in each individual transaction.

For instance, airdropping 100 NFTs with a batch size of 25 will result in 4
individual transactions. Smaller batch sizes tend to be more resource-efficient;
in most cases, the recommeded batch size is 25 actions.
