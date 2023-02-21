import { CollectionProps } from '@services/collection/getCollectionService';

export function isAuthorizedAccount(ual: any, collection: CollectionProps) {
  if (!ual || !collection) return false;

  const isAuthorized =
    (ual && collection && ual?.activeUser?.accountName === collection.author) ||
    collection.authorized_accounts.includes(ual?.activeUser?.accountName);
  return isAuthorized;
}
