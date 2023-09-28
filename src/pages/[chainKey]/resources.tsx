import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';
import { CircleNotch } from 'phosphor-react';

import { Modal } from '@components/Modal';
import { Header } from '@components/Header';
import { ResourceCard } from '@components/ResourceCard';

import * as chainsConfig from '@configs/chainsConfig';
import { getAccount } from '@services/account/getAccount';
import { appName, chainKeyDefault } from '@configs/globalsConfig';
import { stakeResources } from '@services/resources/stakeResources';

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

function Resources({ ual }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const chainKey = (router.query.chainKey ?? chainKeyDefault) as string;
  const chainIdLogged =
    ual?.activeUser?.chainId ?? ual?.activeUser?.chain.chainId;
  const chainId = chainsConfig[chainKey].chainId;

  const [accountResources, setAccountResources] = useState([]);
  const [liquidBalance, setLiquidBalance] = useState('0.0000');
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  useEffect(() => {
    if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
      async function handleResources(actions) {
        try {
          await stakeResources({ activeUser: ual.activeUser, actions });

          modalRef.current?.openModal();
          const title = 'Resource was successfully updated';
          const message = 'Please wait while we refresh the page.';

          setModal({
            title,
            message,
          });

          setTimeout(() => {
            router.reload();
          }, 3000);
        } catch (error) {
          modalRef.current?.openModal();
          const jsonError = JSON.parse(JSON.stringify(error));
          const details = JSON.stringify(error, undefined, 2);
          const message =
            jsonError?.cause?.json?.error?.details[0]?.message ??
            'Unable to stake/buy resources';

          setModal({
            title: 'Error',
            message,
            details,
            isError: true,
          });
        }
      }

      async function loadResources() {
        try {
          const { accountName } = ual.activeUser;

          const result = await getAccount(chainKey, {
            accountName,
          });

          if (result.core_liquid_balance) {
            setLiquidBalance(result.core_liquid_balance);
          }

          const resources = [
            {
              percentage: (
                (result.cpu_limit.available * 100) /
                result.cpu_limit.max
              ).toFixed(2),
              resource: 'CPU',
              label: 'Stake',
              callback: handleResources,
            },
            {
              percentage: (
                (result.net_limit.available * 100) /
                result.net_limit.max
              ).toFixed(2),
              resource: 'NET',
              label: 'Stake',
              callback: handleResources,
            },
            {
              percentage: (
                ((result.ram_quota - result.ram_usage) * 100) /
                result.ram_quota
              ).toFixed(2),
              resource: 'RAM',
              label: 'Buy',
              callback: handleResources,
            },
          ];

          setAccountResources(resources);
        } catch (error) {
          modalRef.current?.openModal();
          const jsonError = JSON.parse(JSON.stringify(error));
          const details = JSON.stringify(error, undefined, 2);
          const message =
            jsonError?.cause?.json?.error?.details[0]?.message ??
            'Unable to get user resources';

          setModal({
            title: 'Error',
            message,
            details,
            isError: true,
          });
        }
      }

      loadResources();
    }
  }, [ual, chainKey, chainIdLogged, chainId, router]);

  function handleLogin() {
    ual?.showModal();
  }

  if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
    return (
      <>
        <Head>
          <title>{`Resources - ${appName}`}</title>
        </Head>

        <Header.Root border>
          <Header.Content title="Resources" />
        </Header.Root>
        <div className="container">
          <h2 className="headline-2 mt-4 md:mt-8">
            Available - {liquidBalance}
          </h2>
          <div className="flex md:flex-row flex-col gap-8 items-center md:my-16 my-8">
            {accountResources.map((item, index) => {
              return (
                <ResourceCard
                  ual={ual}
                  key={index}
                  label={item.label}
                  chainKey={chainKey}
                  resource={item.resource}
                  callback={item.callback}
                  percentage={Number(item.percentage)}
                />
              );
            })}
          </div>
        </div>
        <Modal ref={modalRef} title={modal.title}>
          <p className="body-2 mt-2">{modal.message}</p>
          {!modal.isError ? (
            <span className="flex gap-2 items-center py-4 body-2 font-bold text-white">
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              Refreshing...
            </span>
          ) : (
            <Disclosure>
              <Disclosure.Button className="btn btn-small mt-4">
                Details
              </Disclosure.Button>
              <Disclosure.Panel>
                <pre className="overflow-auto p-4 rounded-lg bg-neutral-700 max-h-96 mt-4">
                  {modal.details}
                </pre>
              </Disclosure.Panel>
            </Disclosure>
          )}
        </Modal>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Resources - ${appName}`}</title>
      </Head>

      {!ual?.activeUser && (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to manage your resources
          </p>
          <button type="button" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
}

export default withUAL(Resources);
