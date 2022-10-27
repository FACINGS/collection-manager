export async function editCollectionService({ action, activeUser, data }) {
  try {
    const response = await activeUser.signTransaction(
      {
        actions: [
          {
            account: 'atomicassets',
            name: action,
            authorization: [
              {
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
              },
            ],
            data,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );

    return response;
  } catch (e) {
    console.error(e);
  }
}
