import { Disclosure, Transition } from '@headlessui/react';
import { CaretDown } from 'phosphor-react';
import * as isIPFS from 'is-ipfs';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { IpfsPreview } from './ipfsPreview';

interface ActionsProps {
  actions: {
    account: string;
    authorization: {
      actor: string;
      permission: string;
    }[];
    data: {
      schema_name: string;
      schema_format?: {
        name: string;
        type: string;
      }[];
      immutable_data?: {
        key: string;
        value: any[];
      }[];
    };
    name: string;
  }[];
}

export function Review({ actions }: ActionsProps) {
  return (
    <>
      {actions.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="headline-2">Review</span>
          <div className="flex flex-row gap-4 items-baseline py-4">
            <div className="flex flex-row gap-2">
              <span className="body-1 font-bold">Schemas</span>
              <span className="badge-small font-bold">1</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="body-1 font-bold">Templates</span>
              <span className="badge-small font-bold">
                {actions.length - 1}
              </span>
            </div>
          </div>
          {actions.map((action, index) => {
            return (
              <div key={index} className="flex bg-neutral-800 rounded-md">
                <>
                  <Disclosure as="div" className="flex flex-col w-full">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between py-4 px-8">
                          <div className="flex flex-row gap-2 items-center">
                            {action.name === 'createschema' ? (
                              <>
                                <span>Schema:</span>
                                <span className="title-1">
                                  {action.data.schema_name}
                                </span>
                              </>
                            ) : (
                              <>
                                <span>Template:</span>
                                <span className="title-1">
                                  {action.data.immutable_data[0].value[1]}
                                </span>
                              </>
                            )}
                          </div>
                          <CaretDown
                            size={32}
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5`}
                          />
                        </Disclosure.Button>
                        <Transition
                          enter="transition duration-300 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-200 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          {action.name === 'createschema' && (
                            <Disclosure.Panel className="flex flex-col gap-4 pb-8 px-8">
                              <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                                <span>Name</span>
                                <span className="font-bold">
                                  {action.data.schema_name}
                                </span>
                              </div>
                              <div className="flex flex-row gap-2 items-center py-4">
                                <span className="body-1 font-bold">
                                  Attributes
                                </span>
                                <span className="badge-small bg-neutral-900 font-bold">
                                  {action.data.schema_format.length}
                                </span>
                              </div>
                              {action.data.schema_format.map((item) => {
                                return (
                                  <div
                                    key={item.name}
                                    className="flex justify-between py-3 body-2 text-white border-b border-neutral-700"
                                  >
                                    <span>{item.name}</span>
                                    <span className="font-bold">
                                      {item.type}
                                    </span>
                                  </div>
                                );
                              })}
                            </Disclosure.Panel>
                          )}
                          {action.name === 'createtempl' && (
                            <Disclosure.Panel className="flex md:flex-row flex-col md:items-start items-center gap-8 pb-8 px-8">
                              <>
                                {action.data.immutable_data && (
                                  <IpfsPreview
                                    immutableData={action.data.immutable_data}
                                  />
                                )}

                                <div className="flex-1 flex-col gap-4 w-full">
                                  {action.data.immutable_data.map((item) => {
                                    return (
                                      <div
                                        key={item.key}
                                        className="flex flex-row gap-4 justify-between py-3 body-2 text-white border-b border-neutral-700"
                                      >
                                        <span>{item.key}</span>
                                        <span className="font-bold">
                                          {isIPFS.cid(item.value[1]) ||
                                          isIPFS.cidPath(item.value[1]) ? (
                                            <a
                                              href={`${ipfsEndpoint}/${item.value[1]}`}
                                              className="font-bold underline break-all"
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {item.value[1]}
                                            </a>
                                          ) : (
                                            item.value[1]
                                          )}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            </Disclosure.Panel>
                          )}
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                </>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
