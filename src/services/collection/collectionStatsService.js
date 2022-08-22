import api from '@services/api';

export async function collectionStatsService(collection) {
    try {
        const response = await api.get(`/atomicassets/v1/collections/${collection}/stats`)
        return response;
    } catch (e) {
        console.error(e);
    }
}