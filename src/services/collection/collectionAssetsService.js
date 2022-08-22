import api from '@services/api';

export async function collectionAssetsService({ collection, page, offset }) {
    try {
        const response = await api.get(`/atomicassets/v1/assets?collection_name=${collection}`, {
            params: {
                page: page || 1,
                limit: 12,
                offset: offset || 12,
                order: 'desc',
                sort: 'asset_id',
            }
        })
        return response;
    } catch (e) {
        console.error(e);
    }
}