import api from '@services/api';

export async function collectionSchemasService({ collection, page, offset }) {
    try {
        const response = await api.get(`/atomicassets/v1/schemas?collection_name=${collection}`, {
            params: {
                page: page || 1,
                limit: 12,
                offset: offset || 12,
                order: 'desc',
                sort: 'created',
            }
        })
        return response;
    } catch (e) {
        console.error(e);
    }
}