# Testing Guide

## Prerequisites

1. Anchor
2. If testing locally: either (a) js dev env or (b) docker. (see ["Getting Started"](../README.txt) for instructions)

## 1. Running the app

Option 1. Locally: `yarn && yarn dev`

Option 2. Docker: `docker-compose up --build --force-recreate`

Open http://localhost:3000 in a web browser to access the app.

Option 3. Public dev instance

https://collectionmanager.test.facings.io

## 2. Testing Stage 1, Milestone 1 deliverables

### Deliverable 1: Base Implementation

> Home page: show featured collections, “about” section, and login link.

Navigating to the app, you will see a list of collections with "about section" near the bottom, and login functionality in the header.

### Deliverable 2: Login & Account

> When logged in, (a) show account, (b) RAM usage, (c) log out link, and (d) list of user's collections

Proceed to login. The app will ask you to launch Anchor to authenticate. Once you do so, you will notice that your account name is in the header. Clicking it will show your current RAM usage, as well as a link to log out. If you have logged in with an account which has already published collections, you will be seeing them now as well.

### Deliverable 3: Collection viewer

> Ability to explore/examine Collections, Schemas, Templates, NFTs.

By clicking on a collection image, you will see collection attributes such as Author, URL, creation date, and stats. You are also able to view Templates, NFTs (assets), schemas, and a list of holder accounts.

Note that many published collections may not have any published shemas or templates. To see one example collection which has a lot of data to demo, you may visit https://collectionmanager.test.facings.io/collections/cutiecatsand (no affiliation).

## 3. Testing Stage 1, Milestone 2 deliverables

### Deliverable 1: Collection Manager

> (1) Create/Edit Collections

1. Ensure you are logged in and navigate to "My Collections".
2. Click on "Create Collection", select an image and fill out the fields, and submit the form
3. You should now see the collection overview.

> (2) Create/Extend Schemas

1. From the collection overview page, click on the "Schemas" tab and then "Create Schema"
2. You will notice that a few default attributes are listed. If you wish to add more, enter a new attribute name, select the value type, and click "Add attribute". Repeat as needed
3. Upon clicking "Create schema", you will be prompted to sign a transaction. Upon broadcast the app will display the newly-created schema.

> (3) Create Templates

1. From the collection overview page, click on the "Templates" tab and then "Create your first template"
2. You will find the schema created in the previous steps will be selected by default. You may also edit a few internal attributes: ability to transfer (default: on), ability to burn (default: on), and max supply (default: unlimited).
3. Fill out the remaining attributes for the chosen schema and press "Create template"

> (4) Create NFTs

1. From the collection overview page, click on "NFTs" tab and then "Create NFT"
2. Select the schema and template to create the NFT from. All other fields are optional, and by default one copy will be created.
3. Click "Create NFT"

> (5) Airdrop NFTs

1. From the top navigation bar, click on "Transfer"
2. You will see a list of all NFTs available to transfer. Click on the items to toggle their inclusion in the transfer.
3. Enter a recipient account name, and optionally a memo
4. Click "Transfer" to sign and broadcast the transaction.

### Deliverable 2: Additional functions

> Lock template

1. Navigate to the template for which you would like to lock supply. Note that its current supply must be greater than zero.
2. Click "Edit Template"
3. Click "Lock template" and execute the transaction.

> Burn NFT

1. Navigate to the NFT you would like to burn.
2. Click on "Edit NFT", then "Burn NFT" tab.
3. Click on the "Burn NFT" button to sign and broadcast the transaction.


## 3. Testing Stage 2, Milestone 1 deliverables

### Deliverable 1: TypeScript Implementation

Two ways of verifying TypeScript migration:

1. Visit https://github.com/FACINGS/collection-manager - on the right-hand panel, you will see "Languages - TypeScript - 98.9%"
2. In the CLI:
   - Run `find src/** -type f | wc -l` to count all source code files (`104`).
   - Run `find src/** -type f | grep '.ts' | wc -l` to count all TypeScript files (`104`)
   - Run `yarn lint` to find `No ESLint warnings or errors`

### Deliverable 2: UX Improvements

1. Jungle4 EOS testnet support
   - On the main page of the app, when logged out, you will be able to select Jungle4 in the upper-left select menu.
2. Airdrop - allow minting to multiple accounts
   - When minting from a template, you are now able to select multiple recipients and specify number of copies to mint for each.
3. Transfers - filter NFTs by name or collection
   - On the Transfer page, there is a dropdown to filter by collection, as well as a text input to filter by NFT name.
4. Upgrade navigation / breadcrumbs and small screen optimization
   - All pages in the collection manager UI now have breadcrumb navigation to easily navigate the object hierarchy.
   - On small screens, the navigation bar items will collapse into a dropdown menu.
5. IPFS updates - manual address entry, previews, validation, view originals
   - When entering fields on new Templates or NFTs, you may specify an IPFS hash.
   - Enhanced previews on IPFS fields.
   - Automatic validation of uploaded media via browser-supplied content MIME type.
   - Ability to click an IPFS hash when viewing Templates/NFTs to view the original media.
6. Metadata handling
   - new social links for collection on the Create Collection and Edit Collection pages
   - better defaults for schema: friendlier handling of `img` and `video` fields on the create schema page
   - allow blank immutable fields: when creating templates, there is a toggle switch allowing the user to specify that a blank value should be added as immutable (as opposed to left out of the template definition)
   - improved input validations: collection and schema name fields now follow precise rules of EOS account names

### Deliverable 3: Plugin Architecture

Documentation of the plugin system and instructions on how to install a sample plugin from GitHub or create a plugin from scratch are found here:

https://github.com/FACINGS/collection-manager/blob/main/docs/plugins.md



## 4. Testing Stage 2, Milestone 2 deliverables

### Deliverable 1: Import Function

> Development of an AtomicAssets CSV standard

You may view the documentation of the standard here: [Data Import Plugin](plugin-import.md).

> Ability to import a CSV to create a schema and templates

1. Download sample file: [fruits.csv](plugin-import-sample/fruits.csv)
2. Browse to a collection you have created
3. Click "Add-ons" in the navigation bar, then "Import"
4. Select the `fruits.csv` file from step 1
5. You will see a data review showing 1 schema and 4 templates to be created with no errors detected.

> Minimal data validation to help detect user errors

1. Download sample file: [fruits.fail.csv](plugin-import-sample/fruits.fail.csv)
2. Start on the "Import" page (Collection > Add-ons > Import)
3. Select the `fruits.fail.csv` file you downloaded in step 1
4. You will see two errors detected:
   1. The `img` field for "Apple" is invalid (value is `123` when an IPFS address was expected)
   2. The `points` field for "Banana" is invalid (value is `abc` when a integer was expected)

> Ability to submit transactions in batches


1. Download sample file: [batch.test.csv](plugin-import-sample/batch.test.csv)
2. Start on the "Import" page (Collection > Add-ons > Import)
3. Select the `batch.test.csv` file you downloaded in step 1
4. You will see a notice notifying you that the process will be split into multiple transactions,
   and you will be able to adjust the batch size from the default of 25, if desired.
5. Submitting the form will result in the user being prompted to sign a series of transactions.


### Deliverable 2: Advanced Validation

> Data validation heuristics upon import:
>  (a) Uniqueness;
>  (b) Completeness;
>  (c) Datatype optimization

1. Download sample file: [validationtest.csv](plugin-import-sample/validationtest.csv)
2. Start on the "Import" page (Collection > Add-ons > Import)
3. Select the `validationtest.csv` file you downloaded in step 1
4. You will see the following notices and errors:
   1. Datatype optimization notice: the attribute `rating` is a `uint64` but since all values are in a smaller range we suggest you use `uint8` instead
   2. Uniqueness error: "Apple" and "Banana" have a repeated value for the `img` field
   3. Required field error: "Kiwi" is missing a value for the `points` field, which was marked as 'required'
   4. IPFS field validation error: "Orange" has an invalid entry for the `img` field, which expects an IPFS address
