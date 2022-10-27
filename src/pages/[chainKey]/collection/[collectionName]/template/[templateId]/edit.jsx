import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';
import { CircleNotch, ImageSquare } from 'phosphor-react';

import { ipfsEndpoint } from '@configs/globalsConfig';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getTemplateService } from '@services/template/getTemplateService';
import { lockTemplateService } from '@services/template/lockTemplateService';
import { getCollectionService } from '@services/collection/getCollectionService';

import { Modal } from '@components/Modal';

function EditTemplate({ ual, collection, template, chainKey }) {
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

  const image = template.immutable_data.img;
  const video = template.immutable_data.video;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  const enableLock = Number(template.issued_supply) > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  function handleLogin() {
    ual?.showModal();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        activeUser: ual.activeUser,
        authorized_editor: ual.activeUser.accountName,
        collection_name: collection.collection_name,
        template_id: template.template_id,
      };

      await lockTemplateService(data);

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Template was successfully locked';
      const message = 'Please await while we redirect you.';

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

  if (hasAuthorization) {
    return (
      <>
        <header className="-mt-14 overflow-hidden -z-10">
          <div className="container flex items-center">
            <div className="flex-1">
              <div>
                <h2 className="headline-2 block mb-2">Edit Template</h2>
                <p className="headline-2 mb-2">#{template.template_id}</p>
              </div>
              <h1 className="headline-1">{template.name}</h1>
            </div>
            <div className="flex-1 flex justify-center py-32">
              <div className="relative max-w-sm w-full aspect-square drop-shadow-lg">
                <>
                  {image && (
                    <>
                      <Image
                        alt={template.name}
                        src={`${ipfsEndpoint}/${image}`}
                        layout="fill"
                        objectFit="contain"
                      />
                      <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                        <Image
                          alt={template.name}
                          src={`${ipfsEndpoint}/${image}`}
                          layout="fill"
                          objectFit="fill"
                          quality={1}
                        />
                      </div>
                    </>
                  )}
                  {video && (
                    <>
                      <video
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source
                          src={`${ipfsEndpoint}/${video}`}
                          type="video/mp4"
                        />
                      </video>
                      <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                        <video
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source
                            src={`${ipfsEndpoint}/${video}`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </>
                  )}
                  {!video && !image && (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <ImageSquare size={64} />
                    </div>
                  )}
                </>
              </div>
            </div>
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
      </>
    );
  }

  return (
    <>
      {!ual?.activeUser ? (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to edit a template.
          </p>
          <button type="text" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-8 py-24 text-center">
          <h4 className="headline-3">
            You don't have authorization to edit this template.
          </h4>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName, templateId } = params;

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
}

export default withUAL(EditTemplate);
