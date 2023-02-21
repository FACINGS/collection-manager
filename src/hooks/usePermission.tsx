import { ConnectWallet } from '@components/ConnectWallet';
import { NotAllowed } from '@components/NotAllowed';

interface PermissionProps {
  loggedAccountName: string;
  collectionAuthor: string;
  collectionAuthorizedAccounts: string[];
}

export function usePermission({
  loggedAccountName,
  collectionAuthor,
  collectionAuthorizedAccounts,
}: PermissionProps) {
  const isAuthorized =
    loggedAccountName === collectionAuthor ||
    collectionAuthorizedAccounts.includes(loggedAccountName);

  return {
    PermissionDenied: !loggedAccountName
      ? ConnectWallet
      : !isAuthorized
      ? NotAllowed
      : null,
  };
}
