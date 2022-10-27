import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { CaretDown } from 'phosphor-react';

import { getAccount } from '@services/account/getAccount';
import { getChainKeyByChainId } from '@utils/getChainKeyByChainId';

import * as chainsConfig from '@configs/chainsConfig';

function LoginComponent({ chainKey, ual }) {
  const router = useRouter();
  const [amountAvailableRam, setAmountAvailableRam] = useState();

  const chainIdLogged =
    ual?.activeUser?.chainId ?? ual?.activeUser?.chain.chainId;

  const chainId = chainsConfig[chainKey].chainId;

  useEffect(() => {
    if (!!chainId && !!chainIdLogged && chainId !== chainIdLogged) {
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

        const quota = parseInt(response.ram_quota);
        const used = parseInt(response.ram_usage);

        setAmountAvailableRam((((quota - used) * 100) / quota).toFixed(2));
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
      <Menu.Button className="flex gap-1 items-center body-2 font-bold p-4 ui-open:text-white ui-not-open:text-neutral-400">
        {ual.activeUser.accountName}
        <CaretDown size={16} weight="bold" className="ui-open:rotate-180" />
      </Menu.Button>

      <Menu.Items className="absolute z-10 bg-neutral-800 top-14 right-0 rounded">
        <Menu.Item disabled>
          <div className="ui-active:bg-neutral-700 body-3 font-bold text-white p-4 border-b border-neutral-700">
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
            className="ui-active:bg-neutral-700 w-full body-2 font-bold px-8 py-4 rounded"
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
