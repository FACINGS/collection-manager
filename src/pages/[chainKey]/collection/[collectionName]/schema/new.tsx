import { useState, useRef } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import { CircleNotch } from 'phosphor-react';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { createSchemaService } from '@services/schema/createSchemaService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';

import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Attributes } from '@components/schema/Attributes';
import { Header } from '@components/Header';
import { usePermission } from '@hooks/usePermission';

import { collectionTabs } from '@utils/collectionTabs';

import { appName } from '@configs/globalsConfig';

const defaultAttributes = [{ name: 'name', type: 'string' }];

const schema = yup.object().shape({
  schemaName: yup.string().eosName(),
  attributes: yup.array().of(
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

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

interface NewSchemaProps {
  ual: any;
  chainKey: string;
  collection: CollectionProps;
}

interface FormaDataProps {
  schemaName: string;
  attributes: {
    name: string;
    type: string;
  }[];
}

function NewSchema({ ual, collection, chainKey }: NewSchemaProps) {
  const { PermissionDenied } = usePermission({
    loggedAccountName: ual?.activeUser?.accountName,
    collectionAuthor: collection.author,
    collectionAuthorizedAccounts: collection.authorized_accounts,
  });

  const router = useRouter();
  const modalRef = useRef(null);
  const attributeModalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      schemaName: '',
      attributes: [
        { name: 'img', type: 'image' },
        { name: 'video', type: 'string' },
      ],
    },
  });

  async function onSubmit({ schemaName, attributes }: FormaDataProps) {
    const hasImageOrVideoAttribute = attributes.some(
      (attribute) =>
        (attribute.name === 'img' && attribute.type === 'image') ||
        (attribute.name === 'video' && attribute.type === 'string')
    );

    if (!hasImageOrVideoAttribute) {
      attributeModalRef.current?.openModal();
      return;
    }

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

  if (PermissionDenied) {
    return <PermissionDenied />;
  }

  return (
    <>
      <Head>
        <title>{`New Schema - ${appName}`}</title>
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
            collectionTabs[1].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[1].key}`,
          ],
          ['New Schema'],
        ]}
      >
        <Header.Content title="New Schema" />
      </Header.Root>

      <Modal ref={attributeModalRef} title="Add img or video attribute">
        <p className="body-2 mt-2">
          Your schema must contain at least one <strong>img</strong> attribute
          with type <strong>Image</strong> or one <strong>video</strong>{' '}
          attribute with type <strong>Text</strong>.
        </p>
      </Modal>

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
                maxLength={12}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;

  const { data: collection } = await getCollectionService(chainKey, {
    collectionName,
  });

  return {
    props: {
      chainKey,
      collection: collection.data,
    },
  };
};

export default withUAL(NewSchema);
