# Testing Guide

## Prerequisites

1. Anchor
2. If testing locally: either (a) js dev env or (b) docker.

## 1. Running the app

Option 1. Locally: `yarn dev`

Option 2. Docker: `docker-compose up --build --force-recreate .`

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
