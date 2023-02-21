interface createSchemaServiceProps {
  activeUser: any;
  collectionName: string;
  schemaName: string;
  schemaFormat: {
    name: string;
    type: string;
  }[];
}

export async function createSchemaService({
  activeUser,
  collectionName,
  schemaName,
  schemaFormat,
}: createSchemaServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'createschema',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_creator: activeUser.accountName,
            collection_name: collectionName,
            schema_name: schemaName,
            schema_format: schemaFormat,
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
