interface EditSchemaServiceProps {
  activeUser: any;
  authorized_editor: string;
  collection_name: string;
  schema_name: string;
  schema_format_extension: {
    name: string;
    type: string;
  }[];
}

export async function editSchemaService({
  activeUser,
  authorized_editor,
  collection_name,
  schema_name,
  schema_format_extension,
}: EditSchemaServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'extendschema',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_editor,
            collection_name,
            schema_name,
            schema_format_extension,
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
