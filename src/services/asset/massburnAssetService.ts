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
interface burnAssetProps {
  activeUser: any;
  actions: ActionProps[];
}

export async function burnAssetService({
  activeUser,
  actions,
}: burnAssetProps) {
  const response = await activeUser.signTransaction(
    {
      actions,
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );

  return response;
}
