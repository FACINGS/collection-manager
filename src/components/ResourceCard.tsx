import { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { Input } from '@components/Input';

interface ResourceProps {
  ual: any;
  percentage: number;
  chainKey: string;
  resource: string;
  label: string;
  callback?: (prop) => void;
}

export function ResourceCard({
  ual,
  percentage,
  resource,
  label,
  chainKey,
  callback,
}: ResourceProps) {
  const [inputValue, setInputValue] = useState('1');

  const isWaxChain = ['wax', 'wax-test'].includes(chainKey);
  const resourceChain = isWaxChain ? 'WAX' : 'EOS';

  function handleActions() {
    const actions = [];
    const unstakeActions = [];

    const resourceValue = `${parseInt(inputValue).toFixed(
      resourceChain === 'WAX' ? 8 : 4
    )} ${resourceChain}`;

    const defaultValue = `${
      resourceChain === 'WAX' ? '0.00000000' : '0.0000'
    } ${resourceChain}`;

    if (isWaxChain) {
      actions.push({
        account: 'bw.facings',
        name: 'boost',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {},
      });
    }

    if (resource === 'RAM') {
      actions.push({
        account: 'eosio',
        name: 'buyram',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {
          payer: ual.activeUser.accountName,
          receiver: ual.activeUser.accountName,
          quant: resourceValue,
        },
      });

      unstakeActions.push({
        account: 'eosio',
        name: 'sellram',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {
          account: ual.activeUser.accountName,
          bytes: inputValue,
        },
      });
    } else {
      actions.push({
        account: 'eosio',
        name: 'delegatebw',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {
          from: ual.activeUser.accountName,
          receiver: ual.activeUser.accountName,
          stake_net_quantity: resource === 'NET' ? resourceValue : defaultValue,
          stake_cpu_quantity: resource === 'CPU' ? resourceValue : defaultValue,
          transfer: false,
        },
      });

      unstakeActions.push({
        account: 'eosio',
        name: 'undelegatebw',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {
          from: ual.activeUser.accountName,
          receiver: ual.activeUser.accountName,
          unstake_net_quantity:
            resource === 'NET' ? resourceValue : defaultValue,
          unstake_cpu_quantity:
            resource === 'CPU' ? resourceValue : defaultValue,
          transfer: false,
        },
      });
    }

    return { stake: actions, unstake: unstakeActions };
  }

  const actions = handleActions();

  return (
    <div className="flex flex-col gap-8 bg-neutral-800 p-8 w-60 rounded items-center">
      <div className="flex flex-col gap-2 items-center">
        <div className="flex px-4 pt-4">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: '#404040',
              textColor: 'white',
              pathColor: isWaxChain ? '#ffd238' : '#0f4fe3',
            })}
          />
        </div>
        <span className="headline-2">{resource}</span>
      </div>
      {isWaxChain && (
        <div className="flex flex-col gap-4">
          <Input
            label={`Amount of ${resource}`}
            defaultValue={1}
            type="number"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="button"
            className="btn w-full"
            onClick={() => callback(actions.stake)}
          >
            {label}
          </button>
          <button
            type="button"
            className="btn w-full"
            onClick={() => callback(actions.unstake)}
          >
            {label === 'Stake' ? 'Unstake' : 'Sell'}
          </button>
        </div>
      )}
    </div>
  );
}
