import api from '@services/api';

export async function collectionAccountsService({ collection, page, offset }) {
  try {
    const response = await api.get(
      `/atomicassets/v1/accounts?collection_name=${collection}`,
      {
        params: {
          page: page || 1,
          limit: 12,
          offset: offset || 12,
          order: 'desc',
        },
      }
    );
    return response;
  } catch (e) {
    console.error(e);
  }
}
