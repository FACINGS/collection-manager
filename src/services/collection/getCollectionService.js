import api from '@services/api';

export async function getCollectionService(collection) {
  try {
    const response = await api.get(
      `/atomicassets/v1/collections/${collection}`
    );
    return response;
  } catch (e) {
    console.error(e);
  }
}
