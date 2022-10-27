export async function updateMutableDataService({
  activeUser,
  authorized_editor,
  asset_owner,
  asset_id,
  new_mutable_data,
}) {
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
      expireSeconds: 30,
    }
  );

  return response;
}
