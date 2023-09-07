interface CreateCollectionProps {
  activeUser: any;
  author: string;
  collectionName: string;
  notify: boolean;
  authorizedAccounts: string[];
  notifyAccounts: string[];
  marketFee: number;
  data: { key: string; value: string[] }[];
}

export async function createCollectionService({
  activeUser,
  author,
  collectionName,
  notify,
  authorizedAccounts,
  notifyAccounts,
  marketFee,
  data,
}: CreateCollectionProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'createcol',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            author,
            collection_name: collectionName,
            allow_notify: notify,
            authorized_accounts: authorizedAccounts,
            notify_accounts: notifyAccounts,
            market_fee: marketFee,
            data,
          },
        },
        {
          account: 'atomicassets',
          name: 'createschema',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_creator: activeUser.accountName,
            collection_name: collectionName,
            schema_name: collectionName,
            // current default schema of NFTs on XPR Network
            schema_format: [
              { name: 'name', type: 'string' },
              { name: 'desc', type: 'string' },
              { name: 'image', type: 'string' },
              { name: 'audio', type: 'string' },
              { name: 'video', type: 'string' },
              { name: 'model', type: 'string' },
              { name: 'glbthumb', type: 'string' },
            ],
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 120,
    }
  );

  return response;
}
