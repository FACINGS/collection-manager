export function isAuthorizedAccount(ual, collection) {
  if (!ual || !collection) return false;

  const isAuthorized =
    (ual && collection && ual?.activeUser?.accountName === collection.author) ||
    collection.authorized_accounts.includes(ual?.activeUser?.accountName);
  return isAuthorized;
}
