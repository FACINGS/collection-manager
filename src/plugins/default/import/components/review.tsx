import { Disclosure, Transition } from '@headlessui/react';
import { CaretDown, WarningCircle } from 'phosphor-react';
import * as isIPFS from 'is-ipfs';
import 'tailwindcss/tailwind.css';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { IpfsPreview } from './ipfsPreview';
import { SchemaProps } from '@services/schema/getSchemaService';

interface ActionsProps {
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
}

interface ReviewProps {
  actions: ActionsProps[];
  errors: any[];
  schema: SchemaProps;
}

export function Review({ actions, errors, schema }: ReviewProps) {
  const templateInfo = ['burnable', 'transferable', 'max_supply'];

  const schemas = actions.filter((item) => item.name === 'createschema').length;
  const templates = actions.filter(
    (item) => item.name === 'createtempl'
  ).length;

  function handleError(index: number) {
    const filteredErrors = errors.filter((item) => item.index === index);
    const propertyMap = {};

    for (const item of filteredErrors) {
      if (item.property) {
        if (!propertyMap[item.property]) {
          propertyMap[item.property] = item;
        } else {
          if (item.type === 'required') {
            const previousItem = propertyMap[item.property];
            const previousItemIndex = filteredErrors.indexOf(previousItem);
            filteredErrors.splice(previousItemIndex, 1);
            propertyMap[item.property] = item;
          } else if (propertyMap[item.property].type === 'required') {
            const currentItemIndex = filteredErrors.indexOf(item);
            filteredErrors.splice(currentItemIndex, 1);
          }
        }
      }
    }

    return filteredErrors;
  }

  return (
    <>
      {actions.length > 0 && (
        <div className="flex flex-col gap-8">
          <span className="headline-2">Review</span>
          <div className="flex flex-row gap-4 items-baseline">
            <div className="flex flex-row gap-2">
              <span className="body-1 font-bold">Schemas</span>
              <span className="badge-small font-bold">{schemas}</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="body-1 font-bold">Templates</span>
              <span className="badge-small font-bold">{templates}</span>
            </div>
            {errors.length > 0 && (
              <div className="flex flex-row gap-2">
                <span className="body-1 font-bold">Errors</span>
                <span className="badge-small font-bold">{errors.length}</span>
              </div>
            )}
          </div>
          {schema && (
            <div className="flex bg-neutral-800 rounded-md border border-yellow-600">
              <Disclosure as="div" className="flex flex-col w-full">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between py-4 px-8 rounded-md hover:bg-neutral-700 duration-300">
                      <div className="flex flex-row gap-2 items-center">
                        <>
                          <span className="title-1">Schema:</span>
                          <span className="body-1">{schema.schema_name}</span>
                          <span className="body-1 text-yellow-600">
                            (Already exists in this collection)
                          </span>
                        </>
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
                      <Disclosure.Panel className="flex flex-col items-start gap-8 pb-8 pt-4 px-8">
                        <>
                          <div className="flex flex-row items-center p-8 gap-4 bg-yellow-50 text-neutral-900 rounded-md w-full">
                            <div className="text-yellow-600 p-3.5 rounded-full bg-yellow-400/10">
                              <WarningCircle size={28} />
                            </div>
                            <div className="flex flex-col">
                              <>
                                <span className="title-1">
                                  Schema already exists
                                </span>
                                <span className="body-2">
                                  The following schema was found in this
                                  collection with the same name as the one from
                                  the imported file, so no action will be
                                  created to add it.
                                </span>
                              </>
                            </div>
                          </div>
                          <div className="flex flex-col w-full gap-8">
                            <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                              <span>Name</span>
                              <span className="font-bold">
                                {schema.schema_name}
                              </span>
                            </div>
                            <div className="flex flex-row gap-2 items-center pt-4">
                              <span className="body-1 font-bold">
                                Attributes
                              </span>
                              <span className="badge-small bg-neutral-900 font-bold">
                                {schema.format?.length}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              {schema.format.map((item) => {
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
                            </div>
                          </div>
                        </>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {actions.map((action, index) => {
              const error = handleError(index);

              return (
                <div
                  key={index}
                  className={`flex bg-neutral-800 rounded-md ${
                    error.some((item) => item.index === index) &&
                    'border-2 border-red-600'
                  }`}
                >
                  <>
                    <Disclosure as="div" className="flex flex-col w-full">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between py-4 px-8 rounded-md hover:bg-neutral-700 duration-300">
                            <div className="flex flex-row gap-2 items-center">
                              {action.name === 'createschema' ? (
                                <>
                                  <span className="title-1">Schema:</span>
                                  <span className="body-1">
                                    {action.data.schema_name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="title-1">Template:</span>
                                  <span className="body-1">
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
                              <Disclosure.Panel className="flex flex-col items-start gap-8 pb-8 pt-4 px-8">
                                <>
                                  {error.length > 0 &&
                                    error.map((err, key) => {
                                      if (err.index === index) {
                                        return (
                                          <div
                                            key={key}
                                            className="flex flex-row items-center p-8 gap-4 bg-red-50 text-neutral-900 rounded-md w-full"
                                          >
                                            <div className="text-red-600 p-3.5 rounded-full bg-red-400/10">
                                              <WarningCircle size={28} />
                                            </div>
                                            <div className="flex flex-col">
                                              <>
                                                <span className="title-1">
                                                  {err.title}
                                                </span>
                                                <span className="body-2">
                                                  {err.message}
                                                </span>
                                              </>
                                            </div>
                                          </div>
                                        );
                                      }
                                    })}
                                  <div className="flex flex-col w-full gap-8">
                                    <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                                      <span>Name</span>
                                      <span className="font-bold">
                                        {action.data.schema_name}
                                      </span>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center pt-4">
                                      <span className="body-1 font-bold">
                                        Attributes
                                      </span>
                                      <span className="badge-small bg-neutral-900 font-bold">
                                        {action.data.schema_format.length}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
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
                                    </div>
                                  </div>
                                </>
                              </Disclosure.Panel>
                            )}
                            {action.name === 'createtempl' && (
                              <Disclosure.Panel className="flex flex-col items-start gap-8 pb-8 pt-4 px-8">
                                <>
                                  {error.length > 0 &&
                                    error.map((err, key) => {
                                      if (err.index === index) {
                                        return (
                                          <div
                                            key={key}
                                            className="flex flex-row items-center p-8 gap-4 bg-red-50 text-neutral-900 rounded-md w-full"
                                          >
                                            <div className="text-red-600 p-3.5 rounded-full bg-red-400/10">
                                              <WarningCircle size={28} />
                                            </div>
                                            <div className="flex flex-col">
                                              <>
                                                <span className="title-1">
                                                  {err.title}
                                                </span>
                                                <span className="body-2">
                                                  {err.message}
                                                </span>
                                              </>
                                            </div>
                                          </div>
                                        );
                                      }
                                    })}
                                  <div className="flex md:flex-row w-full flex-col md:items-start items-center gap-8">
                                    {action.data.immutable_data && (
                                      <IpfsPreview
                                        immutableData={
                                          action.data.immutable_data
                                        }
                                      />
                                    )}
                                    <div className="flex flex-col gap-12 w-full">
                                      <div className="flex flex-col">
                                        <span className="title-1 pb-4">
                                          Immutable data
                                        </span>
                                        {action.data.immutable_data.map(
                                          (item) => {
                                            return (
                                              <div
                                                key={item.key}
                                                className="flex flex-row gap-4 justify-between py-3 body-2 text-white border-b border-neutral-700"
                                              >
                                                <span>{item.key}</span>
                                                <span className="font-bold">
                                                  {isIPFS.cid(item.value[1]) ||
                                                  isIPFS.cidPath(
                                                    item.value[1]
                                                  ) ? (
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
                                          }
                                        )}
                                      </div>
                                      <div className="flex flex-col pt-8">
                                        <span className="title-1 pb-4">
                                          Details
                                        </span>
                                        {templateInfo.map((item) => {
                                          return (
                                            <div
                                              key={item}
                                              className="flex flex-row gap-4 justify-between py-3 body-2 text-white border-b border-neutral-700"
                                            >
                                              <span>{item}</span>
                                              <span className="font-bold">
                                                {String(action.data[item])}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
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
        </div>
      )}
    </>
  );
}
