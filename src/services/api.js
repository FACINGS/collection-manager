import axios from 'axios';
import { aaEndpoint } from '@configs/globalsConfig';

const api = axios.create({
  baseURL: aaEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
