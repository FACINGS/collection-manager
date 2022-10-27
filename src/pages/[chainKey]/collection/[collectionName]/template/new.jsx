import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { CircleNotch } from 'phosphor-react';
import { Disclosure } from '@headlessui/react';

import { useForm, Controller } from 'react-hook-form';
import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getCollectionService } from '@services/collection/getCollectionService';
import { createTemplateService } from '@services/template/createTemplateService';
import { collectionSchemasService } from '@services/collection/collectionSchemasService';
import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';

import { Select } from '@components/Select';
import { Switch } from '@components/Switch';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { InputFilePreview } from '@components/InputFilePreview';

function NewTemplate({ ual, collection, schemas, schemasOptions, chainKey }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  const { register, handleSubmit, watch, control } = useForm({
    defaultValues: {
      schemaName: schemas[0]?.schema_name ?? null,
      transferable: true,
      burnable: true,
    },
  });

  const schemaName = watch('schemaName');

  const selectedSchema = schemas.find(
    (schema) => schema.schema_name === schemaName
  );

  const schemasAttributes = selectedSchema?.format;

  function handleLogin() {
    ual.showModal();
  }

  async function onSubmit({
    schemaName,
    transferable,
    burnable,
    maxSupply,
    ...dataAttributes
  }) {
    setIsLoading(true);

    try {
      const filesAttributes = Object.keys(dataAttributes).reduce(
        (accumulatorAttributes, keyAttribute) => {
          const attributeValue = dataAttributes[`${keyAttribute}`];
          if (typeof attributeValue === 'object' && attributeValue.length > 0) {
            return [
              ...accumulatorAttributes,
              {
                name: keyAttribute,
                value: attributeValue[0],
              },
            ];
          }
          return accumulatorAttributes;
        },
        []
      );

      const pinataFiles = await Promise.all(
        filesAttributes.map((fileAttribute) =>
          uploadImageToIpfsService(fileAttribute.value)
        )
      );

      filesAttributes.forEach((fileAttribute, fileAttributeIndex) => {
        dataAttributes[fileAttribute.name] =
          pinataFiles[fileAttributeIndex].IpfsHash;
      });

      const immutableData = [];

      schemasAttributes.forEach(({ name, type }) => {
        const attributeValue = dataAttributes[`${name}`];

        if (
          typeof attributeValue === 'undefined' ||
          attributeValue === '' ||
          attributeValue.length === 0
        ) {
          return;
        }

        if (type === 'image' || type === 'ipfs' || name === 'video') {
          immutableData.push({
            key: name,
            value: ['string', attributeValue],
          });
        } else if (type === 'bool') {
          immutableData.push({
            key: name,
            value: ['uint8', Number(attributeValue)],
          });
        } else if (type === 'double') {
          immutableData.push({
            key: name,
            value: ['float64', Number(attributeValue)],
          });
        } else if (type === 'uint64') {
          immutableData.push({
            key: name,
            value: ['uint64', Number(attributeValue)],
          });
        } else {
          immutableData.push({
            key: name,
            value: [type, attributeValue],
          });
        }
      });

      await createTemplateService({
        activeUser: ual.activeUser,
        authorized_creator: ual.activeUser.accountName,
        collectionName: collection.collection_name,
        schemaName,
        transferable,
        burnable,
        maxSupply: Number(maxSupply),
        immutableData,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Template was successfully created';
      const message = 'Please await while we redirect you.';

      setModal({
        title,
        message,
      });

      async function redirect() {
        const { data: templates } = await collectionTemplatesService(chainKey, {
          collectionName: collection.collection_name,
        });

        setIsSaved(false);

        router.push(
          `/${chainKey}/collection/${collection.collection_name}/template/${templates.data[0].template_id}`
        );
      }

      setTimeout(redirect, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to create template';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }

    setIsLoading(false);
  }

  if (!ual?.activeUser) {
    return (
      <div className="mx-auto my-14 text-center">
        <h2 className="headline-2">Connect your wallet</h2>
        <p className="body-1 mt-2 mb-6">
          You need to connect your wallet to create a new schema
        </p>
        <button type="text" className="btn" onClick={handleLogin}>
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!hasAuthorization) {
    return (
      <div className="container mx-auto px-8 py-24 text-center">
        <h4 className="headline-3">
          You don't have authorization to create a template.
        </h4>
      </div>
    );
  }

  if (schemas.length === 0) {
    return (
      <>
        <header className="border-b border-neutral-700 py-8">
          <div className="container">
            <p className="headline-3 lg:mb-2">{collection.collection_name}</p>
            <h1 className="headline-1">New Template</h1>
          </div>
        </header>

        <div className="container py-8">
          <div className="flex flex-col gap-4 justify-center items-center bg-neutral-800 rounded-xl py-16">
            <span className="title-1">
              There is no schema, please create one to continue.
            </span>
            <Link
              href={`/${chainKey}/collection/${collection.collection_name}/schema/new`}
            >
              <a className="btn">Create schema</a>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="border-b border-neutral-700 py-8">
        <div className="container">
          <p className="headline-3 lg:mb-2">{collection.collection_name}</p>
          <h1 className="headline-1">New Template</h1>
        </div>
      </header>

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

      <div className="container py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full max-w-3xl flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <Controller
                control={control}
                name="schemaName"
                render={({ field }) => (
                  <Select
                    label="Select schema"
                    onChange={field.onChange}
                    selectedValue={field.value}
                    options={schemasOptions}
                  />
                )}
              />
              <Controller
                control={control}
                name="transferable"
                render={({ field }) => (
                  <Switch
                    label="Assets can be transferred"
                    onChange={field.onChange}
                    checked={field.value}
                  />
                )}
              />
              <Controller
                control={control}
                name="burnable"
                render={({ field }) => (
                  <Switch
                    label="Assets can be burned"
                    onChange={field.onChange}
                    checked={field.value}
                  />
                )}
              />
              <Input
                {...register('maxSupply')}
                type="text"
                label="Max supply"
              />
            </div>

            <div>
              <h3 className="headline-2">Set Immutable Attributes</h3>
              <p className="body-1 text-neutral-400 mb-8">
                Every attribute that is filled in here will be immutable. If you
                leave the attribute blank, you will be able to set that data
                during asset creation and it will be mutable.
              </p>

              {schemasAttributes.map((schemaAttribute) => (
                <div
                  key={schemaAttribute.name}
                  className="flex md:flex-row flex-col gap-4 mt-8 md:mt-4"
                >
                  <div className="flex-1 p-3 md:max-w-[15rem] flex items-center justify-center border border-neutral-700 rounded">
                    <span className="body-2 font-bold text-white uppercase whitespace-nowrap">
                      {schemaAttribute.name}
                    </span>
                  </div>
                  <div className="flex-1">
                    {schemaAttribute.type === 'image' ? (
                      <InputFilePreview
                        {...register(schemaAttribute.name)}
                        title="Add Image"
                        accept="image/*"
                      />
                    ) : schemaAttribute.name === 'video' ? (
                      <InputFilePreview
                        {...register(schemaAttribute.name)}
                        title="Add Video"
                        accept="video/*"
                      />
                    ) : schemaAttribute.type === 'bool' ? (
                      <div className="p-3 bg-neutral-800 border border-neutral-700 rounded">
                        <Controller
                          control={control}
                          name={schemaAttribute.name}
                          render={({ field }) => (
                            <Switch
                              onChange={field.onChange}
                              checked={field.value}
                              label={field.value ? 'Enabled' : 'Disabled'}
                            />
                          )}
                        />
                      </div>
                    ) : schemaAttribute.type === 'uint64' ? (
                      <Input
                        {...register(schemaAttribute.name)}
                        type="number"
                        name={schemaAttribute.name}
                        placeholder={'number'}
                      />
                    ) : schemaAttribute.type === 'double' ? (
                      <Input
                        {...register(schemaAttribute.name)}
                        type="number"
                        name={schemaAttribute.name}
                        placeholder={'number'}
                        step="0.01"
                      />
                    ) : schemaAttribute.type === 'ipfs' ? (
                      <Input
                        {...register(schemaAttribute.name)}
                        type="text"
                        name={schemaAttribute.name}
                        placeholder={schemaAttribute.type}
                      />
                    ) : schemaAttribute.type === 'string' ? (
                      <Input
                        {...register(schemaAttribute.name)}
                        type="text"
                        name={schemaAttribute.name}
                        placeholder={'text'}
                      />
                    ) : (
                      <Input
                        {...register(schemaAttribute.name)}
                        type="text"
                        name={schemaAttribute.name}
                        placeholder={schemaAttribute.type}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              {isLoading ? (
                <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
                  <CircleNotch
                    size={24}
                    weight="bold"
                    className="animate-spin"
                  />
                  Loading...
                </span>
              ) : (
                <button
                  type="submit"
                  className={`btn ${
                    isSaved ? 'animate-pulse bg-emerald-600' : ''
                  }`}
                >
                  {isSaved ? 'Saved' : 'Create template'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName } = params;

  const [{ data: collection }, { data: schemas }] = await Promise.all([
    getCollectionService(chainKey, { collectionName }),
    collectionSchemasService(chainKey, { collectionName }),
  ]);

  const schemasOptions = schemas.data.map((schema) => ({
    label: schema.schema_name,
    value: schema.schema_name,
  }));

  return {
    props: {
      chainKey,
      collection: collection.data,
      schemas: schemas.data,
      schemasOptions,
    },
  };
}

export default withUAL(NewTemplate);
