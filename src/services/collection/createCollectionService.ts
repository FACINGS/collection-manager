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
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );

  return response;
}
