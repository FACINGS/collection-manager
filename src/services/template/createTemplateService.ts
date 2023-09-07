interface CreateTemplateServiceProps {
  activeUser: any;
  authorized_creator: string;
  collectionName: string;
  schemaName: string;
  transferable: boolean;
  burnable: boolean;
  maxSupply: number;
  immutableData: {
    key: string;
    value: any[];
  }[];
}
export async function createTemplateService({
  activeUser,
  authorized_creator,
  collectionName,
  schemaName,
  transferable,
  burnable,
  maxSupply,
  immutableData,
}: CreateTemplateServiceProps) {
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
      expireSeconds: 120,
    }
  );

  return response;
}
