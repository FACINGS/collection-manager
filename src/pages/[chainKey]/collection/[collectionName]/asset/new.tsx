import { useState, useEffect, Fragment, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';
import { Listbox, Transition } from '@headlessui/react';
import { CaretDown, Check, CircleNotch, TrashSimple } from 'phosphor-react';
import { GetServerSideProps } from 'next';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { appName } from '@configs/globalsConfig';

import { collectionTabs } from '@utils/collectionTabs';

import { collectionAssetsService } from '@services/collection/collectionAssetsService';
import { createAssetService } from '@services/asset/createAssetService';
import { getAccount } from '@services/account/getAccount';
import {
  collectionTemplatesService,
  TemplateProps,
} from '@services/collection/collectionTemplatesService';
import {
  collectionSchemasService,
  SchemaProps,
} from '@services/collection/collectionSchemasService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';

import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Switch } from '@components/Switch';
import { Header } from '@components/Header';
import { Carousel } from '@components/Carousel';
import { InputPreview } from '@components/InputPreview';

import { usePermission } from '@hooks/usePermission';
import { handlePreview } from '@utils/handlePreview';
import { handleAttributesData } from '@utils/handleAttributesData';

interface NewAssetProps {
  ual: any;
  collection: CollectionProps;
  schemas: SchemaProps[];
  templates: TemplateProps[];
  chainKey: string;
}

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

interface FormDataProps {
  recipients: {
    account: string;
    numberOfCopies: number;
  }[];
  attributes: { [key: string]: any }[];
}

function NewAsset({
  ual,
  collection,
  schemas,
  templates,
  chainKey,
}: NewAssetProps) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { PermissionDenied } = usePermission({
    loggedAccountName: ual?.activeUser?.accountName,
    collectionAuthor: collection.author,
    collectionAuthorizedAccounts: collection.authorized_accounts,
  });

  const [images, setImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<SchemaProps>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateProps>(null);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const remainingSupply =
    selectedTemplate &&
    parseInt(selectedTemplate.max_supply) -
      parseInt(selectedTemplate.issued_supply);

  const wasFullyMinted =
    parseInt(selectedTemplate?.max_supply, 10) > 0 && remainingSupply === 0;

  const asset = yup.object().shape({
    recipients: yup.array().of(
      yup.object().shape({
        account: yup
          .string()
          .eosName()
          .label('Account')
          .test('invalid-account', 'Invalid account', async (value) => {
            try {
              await getAccount(chainKey, {
                accountName: value,
              });

              return true;
            } catch (error) {
              return false;
            }
          }),
        numberOfCopies: yup
          .number()
          .typeError('Must be a number between 1 and 50.')
          .min(1, 'Must be a number between 1 and 50.')
          .max(50, 'Must be a number between 1 and 50.'),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(asset),
  });

  useEffect(() => {
    if (schemas.length > 0) {
      setSelectedSchema(schemas[0]);
    }
  }, [schemas]);

  useEffect(() => {
    const templatesBySchema = templates.filter(
      (template) => template.schema.schema_name === selectedSchema?.schema_name
    );
    setSelectedTemplate(templatesBySchema[0]);
  }, [selectedSchema, templates]);

  useEffect(() => {
    if (selectedTemplate) {
      handlePreview(selectedTemplate, setImages);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  const schemaAttributes = schemas.find(
    (item) => item.schema_name === selectedSchema?.schema_name
  );

  const mutableDataList = schemaAttributes?.format.filter(
    (attribute) =>
      selectedTemplate &&
      selectedTemplate.immutable_data[attribute.name] === undefined
  );

  const {
    fields: recipientsFields,
    append: recipientsAppend,
    remove: recipientsRemove,
  } = useFieldArray({
    control,
    name: 'recipients',
  });

  function handleAddRecipient() {
    recipientsAppend({
      account: '',
      numberOfCopies: '1',
    });
  }

  if (recipientsFields.length === 0 && ual.activeUser) {
    recipientsAppend({
      account: ual.activeUser?.accountName,
      numberOfCopies: 1,
    });
  }

  function handleRemoveRecipient(index: number) {
    recipientsRemove(index);
  }

  async function onSubmit({ recipients, ...attributes }: FormDataProps) {
    setIsLoading(true);

    try {
      const mutableData = await handleAttributesData({
        attributes: attributes,
        dataList: mutableDataList,
      });

      const actions = [];

      recipients.map((recipient) => {
        const action = {
          account: 'atomicassets',
          name: 'mintasset',
          authorization: [
            {
              actor: ual.activeUser.accountName,
              permission: ual.activeUser.requestPermission,
            },
          ],
          data: {
            authorized_minter: ual.activeUser.accountName,
            collection_name: collection.collection_name,
            schema_name: selectedSchema.schema_name,
            template_id: selectedTemplate.template_id,
            new_asset_owner: recipient.account,
            immutable_data: [],
            mutable_data: mutableData,
            tokens_to_back: [],
          },
        };

        let counter = 0;

        while (counter < recipient.numberOfCopies) {
          actions.push(action);
          counter++;
        }
      });

      await createAssetService({
        activeUser: ual.activeUser,
        actions: actions,
      });
      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'NFT was successfully created';
      const message = 'Please await while we redirect you.';

      setModal({
        title,
        message,
      });

      async function redirect() {
        const { data: assets } = await collectionAssetsService(chainKey, {
          collectionName: collection.collection_name,
        });

        setIsSaved(false);

        router.push(
          `/${chainKey}/collection/${collection.collection_name}/asset/${assets.data[0].asset_id}`
        );
      }

      setTimeout(redirect, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to create NFT';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  const templateOptions = templates.filter(
    (template) => template.schema.schema_name === selectedSchema?.schema_name
  );

  if (PermissionDenied) {
    return <PermissionDenied />;
  }

  return (
    <>
      <Head>
        <title>{`New NFT - ${appName}`}</title>
      </Head>

      <Header.Root
        border
        breadcrumb={[
          ['My Collections', `/${chainKey}`],
          [
            collection.collection_name,
            `/${chainKey}/collection/${collection.collection_name}`,
          ],
          [
            collectionTabs[3].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[3].key}`,
          ],
          ['New NFT'],
        ]}
      >
        <Header.Content title="New NFT" />
      </Header.Root>

      <div className="container py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-3xl flex flex-col gap-16 md:items-start items-center"
        >
          <div className="grid md:grid-cols-2 grid-col-1 gap-8 w-full">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col w-full">
                <h3 className="headline-2 block mb-4">Select schema</h3>
                {schemas.length > 0 && selectedSchema ? (
                  <Listbox value={selectedSchema} onChange={setSelectedSchema}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default border border-neutral-700 rounded body-1 bg-neutral-800 p-4 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                        <span className="block truncate">
                          {selectedSchema?.schema_name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <CaretDown
                            size={16}
                            weight="bold"
                            className="ui-open:rotate-180"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none body-3 z-10">
                          {schemas.map((schema, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? 'bg-neutral-700 text-white'
                                    : 'text-white-900'
                                }`
                              }
                              value={schema}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {schema.schema_name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                      <Check size={16} />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                ) : (
                  <button
                    type="button"
                    className="btn w-fit"
                    onClick={() =>
                      router.push(
                        `/${chainKey}/collection/${collection.collection_name}/schema/new`
                      )
                    }
                  >
                    Create schema
                  </button>
                )}
              </div>
              <div className="flex flex-col w-full">
                <h3 className="headline-2 block mb-4">Select template</h3>
                {templateOptions.length > 0 && selectedTemplate ? (
                  <Listbox
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                  >
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default border border-neutral-700 rounded body-1 bg-neutral-800 p-4 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                        <span className="block truncate">
                          {selectedTemplate && selectedTemplate.name
                            ? selectedTemplate.name
                            : 'No name'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <CaretDown
                            size={16}
                            weight="bold"
                            className="ui-open:rotate-180"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none body-3 z-10">
                          {templateOptions.map((template, index) => {
                            return (
                              <Listbox.Option
                                key={index}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-neutral-700 text-white'
                                      : 'text-white-900'
                                  }`
                                }
                                value={template}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {template.name ?? '- No name -'}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                        <Check size={16} />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            );
                          })}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                ) : (
                  <button
                    type="button"
                    className="btn w-fit"
                    onClick={() =>
                      router.push(
                        `/${chainKey}/collection/${collection.collection_name}/template/new`
                      )
                    }
                  >
                    Create template
                  </button>
                )}
              </div>
            </div>
            {selectedTemplate && (
              <div className="flex1">
                <Carousel images={images} />
              </div>
            )}
          </div>

          {schemas.length > 0 &&
          !wasFullyMinted &&
          selectedTemplate &&
          selectedTemplate.immutable_data ? (
            <>
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col w-full">
                  <h3 className="headline-2 block">NFT data</h3>
                  <p className="body-1 text-neutral-400 mb-4">
                    Mint to your own account or airdrop the NFT to specific
                    accounts.
                  </p>
                </div>
                <div className="flex flex-col body-2 text-white gap-4">
                  <div className="flex gap-4 font-bold">
                    <span className="flex-1">NFT Recipient</span>
                    <div className="flex-1">
                      <span className="pr-2">Number of Copies</span>
                      <span className="font-normal text-neutral-400">
                        {`(Between 1-${
                          parseInt(selectedTemplate?.max_supply, 10) > 0 &&
                          remainingSupply &&
                          remainingSupply < 50
                            ? remainingSupply
                            : 50
                        })`}
                      </span>
                    </div>
                  </div>
                  {recipientsFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row gap-4 sm:border-0 border-b border-neutral-700 pb-4 sm:pb-0"
                    >
                      <div className="flex-1">
                        <Input
                          {...register(`recipients.${index}.account`)}
                          error={errors.recipients?.[index]?.account?.message}
                          type="text"
                          maxLength={13}
                        />
                      </div>
                      <div className="flex-1 flex gap-4">
                        <div className="flex-1">
                          <Input
                            {...register(`recipients.${index}.numberOfCopies`)}
                            error={
                              errors.recipients?.[index]?.numberOfCopies
                                ?.message
                            }
                            type="number"
                          />
                        </div>
                        <div className="flex-none">
                          <button
                            type="button"
                            className="btn btn-square"
                            onClick={() => handleRemoveRecipient(index)}
                          >
                            <TrashSimple size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-row gap-4">
                    <div className="flex-1">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleAddRecipient}
                      >
                        Add recipient
                      </button>
                    </div>
                    <div className="flex-1">
                      <span>
                        {selectedTemplate
                          ? 'Remaining Supply: ' +
                            (parseInt(selectedTemplate.max_supply, 10) > 0
                              ? remainingSupply
                              : 'Unlimited')
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col">
                  <h3 className="headline-2 block">Immutable Attributes</h3>
                  <span className="body-1 text-neutral-400">
                    These attributes cannot be changed.
                  </span>
                </div>
                <div className="grid grid-flow-row auto-rows-max md:gap-4 gap-8">
                  {schemaAttributes &&
                    schemaAttributes.format.map((item, index) => {
                      if (!mutableDataList.includes(item)) {
                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-4 mt-8 pb-8 lg:pb-0 lg:mt-4 border-b border-neutral-700 lg:border-none"
                          >
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-4 p-3 flex items-center justify-center border border-neutral-700 rounded">
                              <span className="title-1 text-white whitespace-nowrap">
                                {item.name}
                              </span>
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-8 xl:col-span-8">
                              <Input
                                type="text"
                                placeholder={item.type}
                                value={
                                  selectedTemplate.immutable_data[item.name]
                                }
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>

              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col">
                  <h3 className="headline-2 block">Mutable Attributes</h3>
                  <span className="body-1 text-neutral-400">
                    These attributes are optional and can be modified later.
                  </span>
                </div>
                <div className="grid grid-flow-row auto-rows-max md:gap-4 gap-8">
                  {schemaAttributes &&
                    schemaAttributes.format.map((item, index) => {
                      if (mutableDataList.includes(item)) {
                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-4 mt-8 pb-8 lg:pb-0 lg:mt-4 border-b border-neutral-700 lg:border-none"
                          >
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-4 p-3 flex items-center justify-center border border-neutral-700 rounded">
                              <span className="title-1 text-white whitespace-nowrap">
                                {item.name}
                              </span>
                            </div>
                            <div className="col-span-12 flex sm:col-span-6 lg:col-span-8 xl:col-span-8">
                              {item.type === 'image' ? (
                                <InputPreview
                                  {...register(item.name)}
                                  setValue={setValue}
                                  title="Add Image"
                                  description="Upload or drag and drop an image"
                                  accept="image/*"
                                />
                              ) : item.type === 'video' ? (
                                <InputPreview
                                  {...register(item.name)}
                                  setValue={setValue}
                                  title="Add Video"
                                  description="Upload or drag and drop a video"
                                  accept="video/*"
                                />
                              ) : item.type === 'bool' ? (
                                <Controller
                                  control={control}
                                  name={item.name}
                                  render={({ field }) => (
                                    <Switch
                                      onChange={field.onChange}
                                      checked={field.value}
                                      label={
                                        field.value ? 'Enabled' : 'Disabled'
                                      }
                                    />
                                  )}
                                />
                              ) : (
                                <Input
                                  {...register(item.name)}
                                  error={errors[item.name]?.message}
                                  type="text"
                                  placeholder={
                                    item.type === 'string' ? 'text' : item.type
                                  }
                                />
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </>
          ) : (
            <>
              {wasFullyMinted ? (
                <div className="flex flex-col w-full">
                  <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                    <h4 className="title-1">This template was fully minted.</h4>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                    <h4 className="title-1">
                      You need a schema and a template to continue.
                    </h4>
                  </div>
                </div>
              )}
            </>
          )}

          {isLoading ? (
            <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              Loading...
            </span>
          ) : (
            <button
              type="submit"
              className={`btn w-fit whitespace-nowrap ${
                isSaved && 'animate-pulse bg-emerald-600'
              }`}
              disabled={
                !selectedSchema ||
                !selectedTemplate ||
                wasFullyMinted ||
                (selectedTemplate && !selectedTemplate.immutable_data)
              }
            >
              {isSaved ? 'Saved' : 'Create NFT'}
            </button>
          )}
        </form>

        <Modal ref={modalRef} title={modal.title}>
          <p className="body-2 mt-2">{modal.message}</p>
          {!modal.isError ? (
            <span className="flex gap-2 items-center py-4 body-2 font-bold text-white">
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              Redirecting...
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
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;

  const [{ data: collection }, { data: schemas }, { data: templates }] =
    await Promise.all([
      getCollectionService(chainKey, { collectionName }),
      collectionSchemasService(chainKey, { collectionName }),
      collectionTemplatesService(chainKey, { collectionName }),
    ]);

  return {
    props: {
      chainKey,
      schemas: schemas.data,
      templates: templates.data,
      collection: collection.data,
    },
  };
};

export default withUAL(NewAsset);
