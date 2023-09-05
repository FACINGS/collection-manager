import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';
import { CircleNotch } from '@phosphor-icons/react';

import {
  getTemplateService,
  TemplateProps,
} from '@services/template/getTemplateService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';
import { lockTemplateService } from '@services/template/lockTemplateService';
import { collectionTabs } from '@utils/collectionTabs';

import { Modal } from '@components/Modal';
import { Header } from '@components/Header';

import { appName } from '@configs/globalsConfig';
import { usePermission } from '@hooks/usePermission';
import { handlePreview } from '@utils/handlePreview';

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

interface EditTemplateProps {
  ual: any;
  chainKey: string;
  collection: CollectionProps;
  template: TemplateProps;
}

function EditTemplate({
  ual,
  collection,
  template,
  chainKey,
}: EditTemplateProps) {
  const router = useRouter();
  const modalRef = useRef(null);

  const { PermissionDenied } = usePermission({
    loggedAccountName: ual?.activeUser?.accountName,
    collectionAuthor: collection.author,
    collectionAuthorizedAccounts: collection.authorized_accounts,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    handlePreview(template, setImages);
  }, [template]);

  const enableLock = Number(template.issued_supply) > 0;

  const lockedTemplate =
    Number(template.issued_supply) === Number(template.max_supply);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await lockTemplateService({
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        collection_name: collection.collection_name,
        template_id: template.template_id,
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Template was successfully locked';
      const message = 'Please wait while we redirect you.';

      setModal({
        title,
        message,
      });

      setTimeout(() => {
        router.push(
          `/${chainKey}/collection/${collection.collection_name}/template/${template.template_id}`
        );
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to lock the template';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }

    setIsLoading(false);
  };

  if (PermissionDenied) {
    return <PermissionDenied />;
  }

  return (
    <>
      <Head>
        <title>{`Update template #${template.template_id} - ${appName}`}</title>
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
            collectionTabs[2].name,
            `/${chainKey}/collection/${collection.collection_name}?tab=${collectionTabs[2].key}`,
          ],
          [
            `${template.name}`,
            `/${chainKey}/collection/${collection.collection_name}/template/${template.template_id}`,
          ],
          ['Update'],
        ]}
      >
        <Header.Content title={template.name} />
        <Header.Banner images={images} />
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

      {lockedTemplate ? (
        <div className="container mx-auto py-16 flex flex-col gap-4 items-center">
          <h4 className="headline-3 text-amber-400">Locked template</h4>
          <span className="body-1">
            The max supply is already locked to the current issued supply.
          </span>
        </div>
      ) : (
        <div className="container mx-auto py-16 flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-2 text-center">
            <span className="body-1">
              Locking will prevent further copies of this template from being
              created.
            </span>
            <span className="body-1">
              The max supply will be locked to the current issued supply.
            </span>
          </div>
          {!enableLock && (
            <h4 className="headline-3 text-amber-400">
              You can't lock a template with no NFTs minted.
            </h4>
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
              onClick={handleSubmit}
              disabled={!enableLock}
            >
              {isSaved ? 'Saved' : 'Lock template'}
            </button>
          )}
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const chainKey = params.chainKey as string;
  const collectionName = params.collectionName as string;
  const templateId = params.templateId as string;

  const [{ data: collection }, { data: template }] = await Promise.all([
    getCollectionService(chainKey, { collectionName }),
    getTemplateService(chainKey, { collectionName, templateId }),
  ]);

  return {
    props: {
      chainKey,
      collection: collection.data,
      template: template.data,
    },
  };
};

export default withUAL(EditTemplate);
