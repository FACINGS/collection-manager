export async function createTemplateService({
  activeUser,
  authorized_creator,
  collectionName,
  schemaName,
  transferable,
  burnable,
  maxSupply,
  immutableData,
}) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'createtempl',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_creator,
            collection_name: collectionName,
            schema_name: schemaName,
            transferable,
            burnable,
            max_supply: maxSupply,
            immutable_data: immutableData,
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
