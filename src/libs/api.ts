import axios from 'axios';

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Referer: 'https://collectionmanager.test.facings.io',
  },
});
