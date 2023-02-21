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

import {
  getSchemaService,
  SchemaProps,
} from '@services/schema/getSchemaService';
import { editSchemaService } from '@services/schema/editSchemaService';

import { Modal } from '@components/Modal';
import { Attributes } from '@components/schema/Attributes';
import { Header } from '@components/Header';

import { collectionTabs } from '@utils/collectionTabs';
import { usePermission } from '@hooks/usePermission';

import { appName } from '@configs/globalsConfig';
interface EditSchemaProps {
  ual: any;
  schema: SchemaProps;
  chainKey: string;
  collectionName: string;
}

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

interface AttributeProps {
  name: string;
  type: string;
}

function EditSchema({
  ual,
  schema,
  chainKey,
  collectionName,
}: EditSchemaProps) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { PermissionDenied } = usePermission({
    loggedAccountName: ual?.activeUser?.accountName,
    collectionAuthor: schema.collection.author,
    collectionAuthorizedAccounts: schema.collection.authorized_accounts,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const schemaValidation = yup.object().shape({
    attributes: yup.array().of(
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
    defaultValues: {
      attributes: [],
    },
  });

  async function onSubmit({ attributes }) {
    setIsLoading(true);

    const newAttributes: AttributeProps[] = attributes;

    try {
      await editSchemaService({
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        collection_name: schema.collection.collection_name,
        schema_name: schema.schema_name,
        schema_format_extension: newAttributes,
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

  if (PermissionDenied) {
    return <PermissionDenied />;
  }

  return (
    <>
      <Head>
        <title>{`Update Schema ${schema.schema_name} - ${appName}`}</title>
      </Head>

      <Header.Root
        border
        breadcrumb={[
          ['My Collections', `/${chainKey}`],
          [collectionName, `/${chainKey}/collection/${collectionName}`],
          [
            collectionTabs[1].name,
            `/${chainKey}/collection/${collectionName}?tab=${collectionTabs[1].key}`,
          ],
          [
            schema.schema_name,
            `/${chainKey}/collection/${collectionName}/schema/${schema.schema_name}`,
          ],
          ['Update'],
        ]}
      >
        <Header.Content title={schema.schema_name} />
      </Header.Root>

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;
  const schemaName = params.schemaName as string;

  const { data: schema } = await getSchemaService(chainKey, {
    collectionName,
    schemaName,
  });

  return {
    props: {
      chainKey,
      schema: schema.data,
      collectionName,
    },
  };
};

export default withUAL(EditSchema);
