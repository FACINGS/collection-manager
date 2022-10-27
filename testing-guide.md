# Testing Guide

## Prerequisites

1. Anchor
2. If testing locally: either (a) js dev env or (b) docker.

## 1. Running the app

Option 1. Locally: `yarn && yarn dev`

Option 2. Docker: `docker-compose up --build --force-recreate`

Open http://localhost:3000 in a web browser to access the app.

Option 3. Public dev instance

https://collectionmanager.test.facings.io

## 2. Testing Milestone 1 deliverables

### Deliverable 1: Base Implementation

> Home page: show featured collections, “about” section, and login link.

Navigating to the app, you will see a list of collections with "about section" near the bottom, and login functionality in the header.

### Deliverable 2: Login & Account

> When logged in, (a) show account, (b) RAM usage, (c) log out link, and (d) list of user's collections

Proceed to login. The app will ask you to launch Anchor to authenticate. Once you do so, you will notice that your account name is in the header. Clicking it will show your current RAM usage, as well as a link to log out. If you have logged in with an account which has already published collections, you will be seeing them now as well.

### Deliverable 3: Collection viewer

> Ability to explore/examine Collections, Schemas, Templates, Assets.

By clicking on a collection image, you will see collection properties such as Author, URL, creation date, and stats. You are also able to view Templates, NFTs (assets), schemas, and a list of holder accounts.

Note that many published collections may not have any published shemas or templates. To see one example collection which has a lot of data to demo, you may visit https://collectionmanager.test.facings.io/collections/cutiecatsand (no affiliation).

## 3. Testing Milestone 2 deliverables

### Deliverable 1: Collection Manager

> (1) Create/Edit Collections

1. Ensure you are logged in and navigate to "My Collections".
2. Click on "Create Collection", select an image and fill out the fields, and submit the form
3. You should now see the collection overview.

> (2) Create/Extend Schemas

1. From the collection overview page, click on the "Schemas" tab and then "Create Schema"
2. You will notice that a few default attributes are listed. If you wish to add more, enter a new field name, select the value type, and click "Add attribute". Repeat as needed
3. Upon clicking "Create schema", you will be prompted to sign a transaction. Upon broadcast the app will display the newly-created schema.

> (3) Create Templates

1. From the collection overview page, click on the "Templates" tab and then "Create your first template"
2. You will find the schema created in the previous steps will be selected by default. You may also edit a few internal properties: ability to transfer (default: on), ability to burn (default: on), and max supply (default: unlimited).
3. Fill out the remaining attributes for the chosen schema and press "Create template"

> (4) Create Assets

1. From the collection overview page, click on "NFTs" tab and then "Create NFT"
2. Select the schema and template to create the NFT from. All other fields are optional, and by default one copy will be created.
3. Click "Create Asset"

> (5) Airdrop assets

1. From the top navigation bar, click on "Transfer"
2. You will see a list of all NFTs available to transfer. Click on the items to toggle their inclusion in the transfer.
3. Enter a recipient account name, and optionally a memo
4. Click "Transfer" to sign and broadcast the transaction.

### Deliverable 2: Additional functions

> Lock template

1. Navigate to the template for which you would like to lock supply. Note that its current supply must be greater than zero.
2. Click "Edit Template"
3. Click "Lock template" and execute the transaction.

> Burn asset

1. Navigate to the asset you would like to burn.
2. Click on "Edit NFT", then "Burn Asset" tab.
3. Click on the "Burn asset" button to sign and broadcast the transaction.
