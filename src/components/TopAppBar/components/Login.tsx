import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { CaretDown, HardDrives, SignOut } from 'phosphor-react';
import Link from 'next/link';

import { getAccount } from '@services/account/getAccount';
import { getChainKeyByChainId } from '@utils/getChainKeyByChainId';

import * as chainsConfig from '@configs/chainsConfig';

interface LoginComponentProps {
  chainKey: string;
  ual: any;
}

function LoginComponent({ chainKey, ual }: LoginComponentProps) {
  const router = useRouter();
  const [amountAvailableRam, setAmountAvailableRam] = useState<string>(null);

  const chainIdLogged = (ual?.activeUser?.chainId ??
    ual?.activeUser?.chain.chainId) as string;

  const chainId = chainsConfig[chainKey].chainId as string;

  useEffect(() => {
    if (
      !!chainId &&
      !!chainIdLogged &&
      chainId !== chainIdLogged &&
      router.pathname !== '/404'
    ) {
      const destination = getChainKeyByChainId(chainIdLogged);
      router.replace(destination);
    }
  }, [chainId, chainIdLogged, router]);

  useEffect(() => {
    async function loadAmountAvailableRam() {
      try {
        const { accountName } = ual.activeUser;
        const response = await getAccount(chainKey, {
          accountName,
        });

        const quota = response.ram_quota;
        const used = response.ram_usage;

        setAmountAvailableRam(() =>
          (((quota - used) * 100) / quota).toFixed(2)
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
      loadAmountAvailableRam();
    }
  }, [ual, chainKey, chainIdLogged, chainId]);

  function handleLogin() {
    ual.showModal();
  }

  function handleLogout() {
    ual.logout();
    router.reload();
  }

  if (!chainIdLogged || !chainId || chainId !== chainIdLogged) {
    return (
      <button type="button" className="btn" onClick={handleLogin}>
        Connect Wallet
      </button>
    );
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex gap-2 md:gap-1 items-center md:text-base text-2xl font-bold p-4 ui-open:text-white ui-not-open:text-neutral-400">
        {ual.activeUser.accountName}
        <CaretDown size={16} weight="bold" className="ui-open:rotate-180" />
      </Menu.Button>

      <Menu.Items className="absolute z-10 bg-neutral-800 top-14 md:right-0 right-4 rounded w-[calc(100%-2rem)] md:w-auto">
        <Menu.Item>
          <Link href={`/${chainKey}/resources`}>
            <div className="flex gap-4 ui-active:bg-neutral-700 md:body-2 body-1 font-bold text-white p-4 border-b border-neutral-700 justify-center">
              <HardDrives size={24} />
              <span>Resources</span>
            </div>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <button
            type="button"
            className="flex gap-4 ui-active:bg-neutral-700 w-full md:body-2 body-1 font-bold p-4 rounded whitespace-nowrap"
            onClick={handleLogout}
          >
            <SignOut size={24} />
            Log Out
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export const Login = withUAL(LoginComponent);
