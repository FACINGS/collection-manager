interface ActionProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    authorized_minter: string;
    collection_name: string;
    schema_name: string;
    template_id: string;
    new_asset_owner: string;
    immutable_data: string;
    mutable_data: string;
    tokens_to_back: string;
  };
}
interface CreateAssetProps {
  activeUser: any;
  actions: ActionProps[];
}

export async function createAssetService({
  activeUser,
  actions,
}: CreateAssetProps) {
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
