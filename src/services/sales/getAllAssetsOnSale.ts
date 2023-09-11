import { getSalesService } from '@services/sales/getSalesService';

export async function getAllAssetsOnSale({
  chainKey,
  collectionName = null,
  seller = null,
  maxlimit = null,
  fast = null,
}) {
  let page = 1;
  const limit = maxlimit || 100;
  let hasNextPage = true;
  let allAssetsOnSale = [];

  while (hasNextPage) {
    let options: {
      limit: number;
      page: number;
      owner?: string;
      collection_name?: string;
      seller?: string;
    } = {
      limit: limit,
      page: page,
    };

    if (collectionName) {
      options.collection_name = collectionName;
    }

    if (seller) {
      options.seller = seller;
    }

    try {
      const response = await getSalesService(chainKey, options);
      const assetsOnSale = response.data.data.flatMap((sale) =>
        sale.assets.map((asset) => asset.asset_id)
      );

      allAssetsOnSale = allAssetsOnSale.concat(assetsOnSale);

      if (!fast) {
        hasNextPage = response.data.data.length > 0;
        if (hasNextPage) {
          page += 1;
        }
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching sales inventory:', error);
      hasNextPage = false; // stop the loop if there's an error
    }
  }
  return allAssetsOnSale;
}
