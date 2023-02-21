interface BurnAssetServiceProps {
  activeUser: any;
  asset_owner: string;
  asset_id: string;
}

export async function burnAssetService({
  activeUser,
  asset_owner,
  asset_id,
}: BurnAssetServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'burnasset',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            asset_owner,
            asset_id,
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
