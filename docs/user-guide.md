The FACINGS NFT Creator allows you to publish, manage, and distribute AtomicAssets NFTs. This guide assumes you have general knowledge of the EOS ecosystem, an Antelope account (such as EOS, WAX, or Proton) with sufficient resources to publish transactions, and a supported wallet such as _Anchor_ or _Cloud Wallet_.
If you need more help getting started with account setup and familiarity with Antelope blockchains, we recommend starting here: https://academy.anyo.io/

If it's your first time publishing an NFT collection or you are simply testing the app, you should create a free testnet account before following this guide. Currently this app supports both [EOS Jungle4 Testnet](https://eosinabox.com/) and [WAX Testnet](https://waxsweden.org/create-testnet-account/). (Click links to create a free testing account.)

## Overview

Important concepts in the AtomicAssets standard (using alphakittens on EOS as an example):

1. **"Collection"**
   1. the top-level record for your project: it can represent a Dapp or art collection.
   2. has a special field _Collection Name_ which must be unique; and once set, it is not editable. This field adheres to the Antelope naming standard for accounts. You can make a short name (less than 12 characters) only if the author account creating the collection has the corresponding short name.
   3. has editable fields such as _Display Name_, _Description_, _Website_, and _Market Fee_.
   4. is the container for _Schemas_, _Templates_, and _NFTs_.
   5. editing permissions are managed throught the `authorized_accounts` field.
   6. example: the `alphakittens` collection has a _Display Name_ of "Alpha Kittens" and a _Market Fee_ of 6%.
2. **"Schema"**
   1. a collection of attributes ("fields") and their data type, e.g. `name (text)`, `age (number)`, `author (text)`.
   2. belongs to a collection. there can be any number of _Schemas_ per _Collection_.
   3. must have a unique name within the collection (e.g. `kittens` or `artwork`).
   4. cannot be renamed or edited after creation, but can have attributes added to it.
   5. example: the `alphakittens` collection has one schema named `kittens` with two attributes: `name (text)` and `age (number)`.
3. **"Template"**
   1. a specific configuration from which NFTs are minted.
   2. must be created from a specific schema (e.g. `kittens`).
   3. determines the total supply of NFTs that can be created from this
      specific Template and its values.
   4. provides values for the attributes in that schema.
   5. designed to make easy work of minting multiple NFTs that are nearly identical.
   6. templates are not tradable, but templates are used to mint NFTs.
   7. cannot be modified after creation, with the exception of limiting supply of unminted NFTs.
   8. determines if attributes of the NFT are _mutable_ (can be modified later)
      or _immutable_ (permanent). If an attribute/value are in a template, they
      are _always_ immutable. Mutable fields are fields which are defined on
      the _schema_ but _not_ the _template_, and are set upon minting the NFT.
   9. example: I'm making a new template from the `kittens` schema, the `name` will be "Tom" and the `age` will be "4".
4. **"NFTs"** (also known as "Assets")
   1. _minted_ (created) from a specific _Template_.
   2. can be minted individually or all at once.
   3. can be minted directly to your account or to any combination of accounts.
   4. may include _mutable_ data that the collection creator can modify.
   5. tradable and burnable (assuming the creator left these "on" when creating the _Template_).

### Additional Resources

- [AtomicAssets Wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Structure) has a high-level overview of these concepts.
- The [WAX Developer Portal](https://developer.wax.io/en/tutorials/howto_atomicassets/collection_struct.html) offers additional technical background and resources.
  ![](https://developer.wax.io/assets/img/tutorials/howto_atomicassets/atomicassets_scheme.jpg)

# User Guide

## 1. Connect your Wallet

1. Open the app: https://creator.facings.io
2. Ensure that the blockchain you wish to use is selected in the upper-left corner (EOS, EOS Jungle 4 Testnet, WAX, or WAX Testnet).
3. Click "Connect Wallet" and authenticate with your wallet to log into the app.
4. You will be taken to the "My Collections" page. If you have already published any collections, they will be shown here.

## 2. Create a Collection

Click the "Create Collection" box. The "New Collection" page will open. Upload an image into the "Add Collection Image" box to the left. Fill out the other required text fields:

1. **Collection Name:** a _permanent_ and _unique_ on-chain name. (e.g. `alphakittens`)
   1. It must be exactly 12 characters (following the same rules as on-chain account names), unless you are specifically creating a collection from a premium account or a sub-account.
   2. Collection names are unique, so you cannot use any name which already belongs to a collection; and once you register your collection, nobody else will be able to use your collection name.
   3. This is generally the name which will be used in URLs for your collection (e.g. `https://creator.facings.io/jungle4/collection/`**`alphakittens`**)
2. **Display Name:** e.g. `Alpha Kittens`. This can be edited in the future.
3. **Website:** e.g. `https://alphakittens.example.com`. This can be edited in the future.
4. **Market fee:** a number between `0` and `15`. This can be edited in the future.
   1. This is the percent which will be charged as a fee (and paid to you) when your NFTs are bought and sold.
   2. Keep in mind that there are additional fees paid to chain resources and
      marketplaces than cannot be changed. Market data suggests a 6% fee is the
      most commonly accepted collection fee.
5. **Description:** a short blurb describing the project, to be shown publicly on collection explorers. This can be edited in the future.
6. **Social Media (optional):** insert none, some or all of the social media you want associated with the collection. This can be edited in the future.
7. **Company Details (optional):** insert none, some or all of the social media you want associated with the collection. This can be edited in the future.

Once you submit the form, you will be asked to sign the transactions. If you receive an error the most common issues are lack of chain resources and duplicative name choice.

Congratulations, your _Collection_ is registered on-chain!

## 3. Create Schema

Now that you have registered a Collection, the next step is to define the schemas/attributes for your NFTs.

1. Click on the "Schemas" tab, and then "Create Schema"

### Naming the Schema

1. The _Name_ must consist of letters `a-z`, digits `1-5`, and/or period (`.`).
   It must be 12 characters or less.
2. Consider using a descriptive name such as `kittens` or `cards`.

### Defining Attributes

1. The default attributes are:
   1. `name` (`Text`)
   2. `img` (`Image`)
   3. `video` (`Text`)
2. `name` is required but `img` or `video` can be removed by clicking on the trash can on the far right of the line.
3. Click the "Add Attribute" button to add any more desired attributes as needed.

#### Schema: Basic Data Types

1. Text - any text, including alphanumeric values and emojis
2. Integer Number - any whole number
3. Floating Point Number - any whole or decimal number
4. Image - standard JPEG, GIF, or PNG image
5. IPFS Hash - a specific IPFS hash for a file of any type
6. Boolean - a true/false (or "yes"/"no") value

Now you may press the "Create Schema" button to sign the transaction.

## 4. Creating a Template

Now that you have created a schema, you can use it to create a template.

1. Click on the "Templates" tab from your collection.
2. Press "Create template".
3. Ensure that the schema you created is selected.

#### Settings

**"NFTs can be transferred"**: leave this On if you wish to allow users to trade their NFTs (recommended). If turned off the NFT will forever live in the account it is created into when you mint it.
**"NFTs can be burned"**: leave this On if you wish to allow users to burn their NFTs (recommended). Turning this off will not allow the NFT to be destroyed at a later date.
**"Max Supply"**: this will determine the maximum number of NFTs which can be minted from this template. Setting a _Max Supply_ of 0 means the template is unbounded (unlimited potential mints). The template can be locked later to prevent additional minting if needed.

#### Immutable Attributes

Here you will see all the attributes you defined in the schema.

Templates contain solely _Immutable Attributes_. Any values you set here will be permanently on the NFTs you mint from this template. If you need your NFTs to have any attributes which can change later, leave them blank here.

When you fill out an attribute (such as "_name_"), you will see the toggle switch to "Immutable" - this means the attribute will not be editable on any of the NFTs you mint from this template. Again, if you want to be able to edit an attribute such as "_name_" on individual NFTs, leave this blank and ensure the toggle switch reads "Mutable".

Once you're done, click "Create Template" to sign the transaction.

## 5. Minting NFTs

1. From your Collection overview, click on the "NFTs" tab, then "Create NFT".
2. Ensure that the correct Schema and Template are selected.
3. **Recipients:** By default, one NFT will be minted to the account you are logged in as. You may add any number of recipients and set any number of copies to mint to each.
4. **Immutable Attributes**: These are the attributes which were set on the template. These cannot be changed, and they will be part of the NFT you mint.
5. **Mutable Attributes**: Any attributes you added to the schema but _not_ the template are considered mutable. You can set those values here or leave them blank to be adjusted later.
6. Click "Create NFT" to sign the transactions.
7. Your selected recipients will now have your minted NFTs!

## 6. Additional Features

### Transfer NFTs

On the upper-right menu, there is a "Transfer" button. Clicking this will take you to a page which shows you all the NFTs you own and allows you to transfer any number of them to another account.

Input the recipients account in the field provided. Ensure you have done this accurately as transfers are not reversible. You can fill in the memo field if you want to however it is not necessary. Keep in mind that anything written in the memo field will be posted on your and the recipients account in their chain history forever. To transfer simply select an NFT and it will be highlighted and show up in the “Selected NFTs” area to the left. Once you have selected all of the NFTs you wish to transfer, click on the “Transfer NFT” button on the left below the NFTs you are transferring. Sign the transaction and you have successfully transferred the NFT(s).

There is a convenient filter and name search to find NFTs that you are looking for to transfer as well.

### Resource Usage

You can see your available resources by clicking your account name in the upper-right corner. It will show you how much RAM you have remaining. You will need to use your wallet to increase or otherwise adjust your account's resources.
