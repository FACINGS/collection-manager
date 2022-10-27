import { useState, useRef } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import { CircleNotch } from 'phosphor-react';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { createSchemaService } from '@services/schema/createSchemaService';
import { getCollectionService } from '@services/collection/getCollectionService';

import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Attributes } from '@components/schema/Attributes';

const defaultAttributes = [
  { name: 'name', type: 'string' },
  { name: 'img', type: 'image' },
  { name: 'video', type: 'string' },
];

const schema = yup.object().shape({
  schemaName: yup.string().eosName(),
  attributes: yup
    .array()
    .unique('name', 'Attribute has already used')
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required()
          .test(
            'testDefaultAttributes',
            'Attribute has already used',
            (value) => {
              const hasDefaultAttributeNameUsed = defaultAttributes.some(
                (defaultAttribute) => defaultAttribute.name === value
              );

              return !hasDefaultAttributeNameUsed;
            }
          )
          .label('Attribute name'),
      })
    ),
});

function NewSchema({ ual, collection, chainKey }) {
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

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit({ schemaName, attributes }) {
    setIsLoading(true);

    const schemaFormat = [...defaultAttributes, ...attributes];

    try {
      await createSchemaService({
        activeUser: ual.activeUser,
        collectionName: collection.collection_name,
        schemaName,
        schemaFormat,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Schema was successfully created';
      const message = 'Please await while we redirect you.';

      setModal({
        title,
        message,
      });

      async function redirect() {
        setIsSaved(false);
        router.push(
          `/${chainKey}/collection/${collection.collection_name}/schema/${schemaName}`
        );
      }

      setTimeout(redirect, 8000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to create schema';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }

    setIsLoading(false);
  }

  function handleLogin() {
    ual.showModal();
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
    <div className="container mx-auto px-8 py-24 text-center">
      <h4 className="headline-3">
        You don't have authorization to create schema.
      </h4>
    </div>;
  }

  return (
    <>
      <header className="border-b border-neutral-700 py-8">
        <div className="container">
          <p className="headline-3 lg:mb-2">{collection.collection_name}</p>
          <h1 className="headline-1">New Schema</h1>
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

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="container py-8">
            <div className="w-full max-w-3xl flex flex-col gap-8">
              <Input
                {...methods.register('schemaName')}
                error={methods.formState.errors.schemaName?.message}
                label="Schema name"
                hint="Must be up to 12 characters (a-z, 1-5, .) and cannot end with a ."
                type="text"
                maxLength="12"
              />

              <Attributes attributes={defaultAttributes} />

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
                    {isSaved ? 'Saved' : 'Create schema'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName } = params;

  const { data: collection } = await getCollectionService(chainKey, {
    collectionName,
  });

  return {
    props: {
      chainKey,
      collection: collection.data,
    },
  };
}

export default withUAL(NewSchema);
