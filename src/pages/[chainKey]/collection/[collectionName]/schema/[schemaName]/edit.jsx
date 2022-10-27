import { useState, useRef } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import { CircleNotch } from 'phosphor-react';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getSchemaService } from '@services/schema/getSchemaService';
import { editSchemaService } from '@services/schema/editSchemaService';

import { Modal } from '@components/Modal';
import { Attributes } from '@components/schema/Attributes';

function EditSchema({ ual, schema, chainKey }) {
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

  const hasAuthorization = isAuthorizedAccount(ual, schema.collection);

  const schemaValidation = yup.object().shape({
    attributes: yup
      .array()
      .unique('name', 'Attribute has already used')
      .of(
        yup.object().shape({
          name: yup
            .string()
            .required()
            .test(
              'hasAttributeAlreadyUsed',
              'Attribute has already used',
              (value) => {
                const hasAttributeAlreadyUsed = schema.format.some(
                  (attribute) => attribute.name === value
                );

                return !hasAttributeAlreadyUsed;
              }
            )
            .label('Attribute name'),
        })
      ),
  });

  const methods = useForm({
    resolver: yupResolver(schemaValidation),
  });

  async function onSubmit({ attributes }) {
    setIsLoading(true);

    try {
      await editSchemaService({
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        collection_name: schema.collection.collection_name,
        schema_name: schema.schema_name,
        schema_format_extension: attributes,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Schema was successfully updated';
      const message = 'Please await while we redirect you.';

      setModal({
        title,
        message,
      });

      setTimeout(() => {
        router.push(
          `/${chainKey}/collection/${schema.collection.collection_name}/schema/${schema.schema_name}`
        );
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to update schema';

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
          You need to connect your wallet to edit this schema
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
          You don't have authorization to edit this schema.
        </h4>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-neutral-700 py-8">
        <div className="container">
          <p className="headline-3 lg:mb-2">Update Schema</p>
          <h1 className="headline-1">{schema.schema_name}</h1>
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
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Attributes attributes={schema.format} />

              <div className="mt-8">
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
                      isSaved && 'animate-pulse bg-emerald-600'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Update schema'}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName, schemaName } = params;

  const { data: schema } = await getSchemaService(chainKey, {
    collectionName,
    schemaName,
  });

  return {
    props: {
      chainKey,
      schema: schema.data,
    },
  };
}

export default withUAL(EditSchema);
