import Image from 'next/image';
import Link from 'next/link';
import { withUAL } from 'ual-reactjs-renderer';
import { Menu } from '@headlessui/react';
import { CaretDown } from 'phosphor-react';

import * as chainsConfig from '@configs/chainsConfig';

import { ChainLink } from './ChainLink';

interface ChainComponentProps {
  ual: any;
  chainKey: string;
}

interface ChainsConfigProps {
  name: string;
  imageUrl: string;
  authenticators: any[];
  aaEndpoint: string;
  chainId: string;
  protocol: string;
  host: string;
  port: string;
}

function ChainComponent({ chainKey, ual }: ChainComponentProps) {
  const chainConfig = chainsConfig[chainKey] as ChainsConfigProps;
  const hasActiveUser = ual?.activeUser;

  if (hasActiveUser || Object.keys(chainsConfig).length === 1) {
    return (
      <Link href={`/${chainKey}/`} className="flex gap-3 items-center py-3">
        <Image width={32} height={32} src={chainConfig?.imageUrl} alt="" />
        <span className="title-1 text-white">{chainConfig?.name}</span>
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex gap-3 items-center py-3 whitespace-nowrap">
        <Image width={32} height={32} src={chainConfig?.imageUrl} alt="" />
        <div className="flex items-center gap-1 title-1 ui-open:text-white ui-not-open:text-neutral-400">
          {chainConfig?.name}
          <CaretDown size={16} weight="bold" className="ui-open:rotate-180" />
        </div>
      </Menu.Button>
      <Menu.Items className="absolute z-10 bg-neutral-800 top-14 left-0 rounded w-max">
        {Object.keys(chainsConfig).map((chainKey) => {
          const chain = chainsConfig[chainKey];

          return (
            <Menu.Item key={chainKey}>
              <ChainLink
                href={`/${chainKey}`}
                className="ui-active:bg-neutral-700 w-full body-2 font-bold p-4 rounded flex items-center gap-2 whitespace-nowrap"
              >
                <div className="flex-none">
                  <Image width={24} height={24} src={chain?.imageUrl} alt="" />
                </div>
                {chain.name}
              </ChainLink>
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
}

export const Chain = withUAL(ChainComponent);
