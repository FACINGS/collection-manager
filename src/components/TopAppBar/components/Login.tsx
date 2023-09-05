import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { CaretDown } from '@phosphor-icons/react';

import { getAccount } from '@services/account/getAccount';
import { getChainKeyByChainId } from '@utils/getChainKeyByChainId';

import chainsConfig from '@configs/chainsConfig';

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
        <Menu.Item disabled>
          <div className="ui-active:bg-neutral-700 md:body-3 body-1 font-bold text-white p-4 border-b border-neutral-700">
            <h4 className="whitespace-nowrap mb-1">Available Resources</h4>
            <div className="flex justify-between">
              <span>RAM</span>
              <span>{amountAvailableRam}%</span>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item>
          <button
            type="button"
            className="ui-active:bg-neutral-700 w-full md:body-2 body-1 font-bold px-8 py-4 rounded"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export const Login = withUAL(LoginComponent);
