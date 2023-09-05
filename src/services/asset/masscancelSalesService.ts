interface ActionProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    sale_id: string;
  };
}
interface CancelSalesAssetProps {
  activeUser: any;
  actions: ActionProps[];
}

export async function CancelSalesAssetService({
  activeUser,
  actions,
}: CancelSalesAssetProps) {
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
