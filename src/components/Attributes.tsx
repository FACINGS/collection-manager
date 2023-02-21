import * as isIPFS from 'is-ipfs';
import { ipfsEndpoint } from '@configs/globalsConfig';
import { ReactNode } from 'react';

interface AttributesListProps {
  children: ReactNode;
}

interface AttributesItemProps {
  name: string;
  value: string;
  type: string;
}

function AttributesList({ children }: AttributesListProps) {
  return <div className="w-full px-4 mx-auto pb-8">{children}</div>;
}

function AttributesItem({ name, value, type }: AttributesItemProps) {
  if (!value) return;

  return (
    <div className="flex justify-between items-center py-3 body-2 gap-8 text-white border-b border-neutral-700">
      <span>{name}</span>
      {type === 'bool' ? (
        <span className="font-bold break-all">{`${Boolean(value)}`}</span>
      ) : isIPFS.cid(value) ? (
        <a
          href={`${ipfsEndpoint}/${value}`}
          className="font-bold underline"
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </a>
      ) : (
        <span className="font-bold break-all">{value}</span>
      )}
    </div>
  );
}

export const Attributes = {
  List: AttributesList,
  Item: AttributesItem,
};
