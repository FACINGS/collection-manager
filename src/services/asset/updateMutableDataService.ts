interface UpdateMutableDataServiceProps {
  activeUser: any;
  authorized_editor: string;
  asset_owner: string;
  asset_id: string;
  new_mutable_data: {
    key: string;
    value: any[];
  }[];
}

export async function updateMutableDataService({
  activeUser,
  authorized_editor,
  asset_owner,
  asset_id,
  new_mutable_data,
}: UpdateMutableDataServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'setassetdata',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_editor,
            asset_owner,
            asset_id,
            new_mutable_data,
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
