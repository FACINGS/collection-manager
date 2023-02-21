interface LockTemplateServiceProps {
  activeUser: any;
  authorized_editor: string;
  collection_name: string;
  template_id: string;
}

export async function lockTemplateService({
  activeUser,
  authorized_editor,
  collection_name,
  template_id,
}: LockTemplateServiceProps) {
  const response = await activeUser.signTransaction(
    {
      actions: [
        {
          account: 'atomicassets',
          name: 'locktemplate',
          authorization: [
            {
              actor: activeUser.accountName,
              permission: activeUser.requestPermission,
            },
          ],
          data: {
            authorized_editor,
            collection_name,
            template_id,
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
