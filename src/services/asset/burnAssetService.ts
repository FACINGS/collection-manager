interface BurnAssetServiceProps {
  activeUser: any;
  asset_owner: string;
  asset_id: string;
}

interface ActionProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    asset_owner: string;
    asset_id: string;
  };
}

interface BurnMultipleAssetProps {
  activeUser: any;
  actions: ActionProps[];
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
      expireSeconds: 120,
    }
  );

  return response;
}

export async function burnMultipleAssetService({
  activeUser,
  actions,
}: BurnMultipleAssetProps) {
  const response = await activeUser.signTransaction(
    {
      actions,
    },
    {
      blocksBehind: 3,
      expireSeconds: 120,
    }
  );

  return response;
}
