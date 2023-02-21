interface EditCollectionProps {
  action: string;
  activeUser: any;
  data: {
    collection_name?: string;
    market_fee?: number;
    account_to_add?: string;
    account_to_remove?: string;
    data?: {
      key: string;
      value: string[];
    }[];
  };
}

export async function editCollectionService({
  action,
  activeUser,
  data,
}: EditCollectionProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: action,
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data,
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
