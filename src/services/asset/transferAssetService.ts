interface TransferAssetServiceProps {
  activeUser: any;
  from: string;
  to: string;
  asset_ids: string[];
  memo: string;
}

export async function transferAssetService({
  activeUser,
  from,
  to,
  asset_ids,
  memo,
}: TransferAssetServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'transfer',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            from,
            to,
            asset_ids,
            memo,
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
