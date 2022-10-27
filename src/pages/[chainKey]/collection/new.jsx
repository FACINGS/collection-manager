import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { withUAL } from 'ual-reactjs-renderer';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { UploadSimple, CircleNotch } from 'phosphor-react';
import { Disclosure } from '@headlessui/react';

import { createCollectionService } from '@services/collection/createCollectionService';
import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';

import { Input } from '@components/Input';
import { Textarea } from '@components/Textarea';
import { Modal } from '@components/Modal';

const schema = yup.object().shape({
  image: yup.mixed().test('image', 'Image is required', (value) => {
    return value.length > 0;
  }),
  collectionName: yup
    .string()
    .matches(/^[a-z1-5.]+$/, {
      message: 'Only lowercase letters (a-z) and numbers 1-5 are allowed.',
      excludeEmptyString: false,
    })
    .eosName('Must be 12 characters (a-z, 1-5) with no spaces.')
    .length(12, 'Must have exactly 12 characters.'),
  displayName: yup.string().required().label('Display name'),
  website: yup.string().url().label('Website'),
  marketFee: yup
    .number()
    .typeError('Must be between 0% and 15%. Only numbers.')
    .min(0, 'Must be between 0% and 15%.')
    .max(15, 'Must be between 0% and 15%.')
    .label('Market fee'),
  description: yup.string(),
});

function CreateNewCollection({ ual }) {
  const router = useRouter();
  const modalRef = useRef(null);

  const [previewImageSrc, setPreviewImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHttpsPrepended, setIsHttpsPrepended] = useState(false);
  const [error, setError] = useState({
    message: '',
    details: '',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const image = watch('image');

  useEffect(() => {
    if (image && image.length > 0) {
      const [img] = image;

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImageSrc(fileReader.result);
      };

      fileReader.readAsDataURL(img);
    } else {
      setPreviewImageSrc(null);
    }
  }, [image]);

  async function onSubmit({
    image,
    collectionName,
    displayName,
    website,
    marketFee,
    description,
  }) {
    setIsLoading(true);

    try {
      const { IpfsHash } = await uploadImageToIpfsService(image[0]);

      await createCollectionService({
        activeUser: ual.activeUser,
        author: ual.activeUser.accountName,
        collectionName,
        notify: true,
        authorizedAccounts: [ual.activeUser.accountName],
        notifyAccounts: [],
        marketFee: marketFee / 100.0,
        data: [
          {
            key: 'name',
            value: ['string', displayName],
          },
          {
            key: 'description',
            value: ['string', description],
          },
          {
            key: 'url',
            value: ['string', website],
          },
          {
            key: 'img',
            value: ['string', IpfsHash],
          },
        ],
      });

      router.push(`/${router.query.chainKey}/collection/${collectionName}`);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to create collection';

      setError({
        message,
        details,
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
          You need to connect your wallet to create a new collection
        </p>
        <button type="text" className="btn" onClick={handleLogin}>
          Connect Wallet
        </button>
      </div>
    );
  }

  const prependHttps = (e) => {
    const { value } = e.target;
    if (value == '') {
      // if field is blank, reset state, don't try to prepend, yet.
      setIsHttpsPrepended(false);
    } else if (!isHttpsPrepended && value.substring(0, 8) !== 'https://') {
      // if we haven't already prepended https (and it's missing), do so now
      e.target.value = 'https://' + value;
      setIsHttpsPrepended(true);
    }
  };

  return (
    <>
      <header className="border-b border-neutral-700 py-8 md:py-12 lg:py-16">
        <div className="container">
          <h1 className="headline-1">New Collection</h1>
        </div>
      </header>

      <Modal ref={modalRef} title="Error">
        <p className="body-2 mt-2">{error.message}</p>
        <Disclosure>
          <Disclosure.Button className="btn btn-small mt-4">
            Details
          </Disclosure.Button>
          <Disclosure.Panel>
            <pre className="overflow-auto p-4 rounded-lg bg-neutral-700 max-h-96 mt-4">
              {error.details}
            </pre>
          </Disclosure.Panel>
        </Disclosure>
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="container
            py-8 md:py-12 lg:py-16
            grid grid-cols-4 gap-8
            md:grid-cols-6 lg:grid-cols-12"
        >
          <div className="col-span-4 md:col-span-3 lg:col-span-5">
            <label
              className={`block aspect-square bg-neutral-800 rounded-xl cursor-pointer p-md border ${
                errors.image?.message ? 'border-red-600' : 'border-neutral-700'
              }`}
            >
              {previewImageSrc ? (
                <div className="w-full h-full relative">
                  <Image
                    src={previewImageSrc}
                    layout="fill"
                    objectFit="contain"
                    alt=""
                  />
                </div>
              ) : (
                <div
                  className={`w-full h-full flex flex-col justify-center items-center gap-2 ${
                    errors.image?.message ? 'text-red-600' : 'text-center'
                  }`}
                >
                  <UploadSimple size={56} weight="bold" />
                  <p className="title-1">Add Collection Image</p>
                  <p className="body-3">
                    Transparent backgrounds are recommended
                  </p>
                </div>
              )}
              <input
                {...register('image')}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
              />
            </label>
          </div>

          <div className="col-span-4 md:col-span-3 lg:col-start-7 lg:col-span-6 flex flex-col gap-8">
            <Input
              {...register('collectionName')}
              error={errors.collectionName?.message}
              label="Collection name"
              hint="Must be 12 characters (a-z, 1-5) with no spaces."
              type="text"
              maxLength="12"
            />
            <Input
              {...register('displayName')}
              error={errors.displayName?.message}
              type="text"
              label="Display Name"
            />
            <Input
              {...register('website')}
              error={errors.website?.message}
              label="Website"
              onChange={(e) => prependHttps(e)}
              type="text"
            />
            <Input
              {...register('marketFee')}
              error={errors.marketFee?.message}
              label="Market fee"
              hint="Must be between 0% and 15%. Only numbers."
              type="number"
              min="0"
              max="15"
              step="0.1"
            />
            <Textarea
              {...register('description')}
              error={errors.description?.message}
              type="text"
              label="Description"
            />
            {isLoading ? (
              <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
                <CircleNotch size={24} weight="bold" className="animate-spin" />
                Loading...
              </span>
            ) : (
              <button type="submit" className="btn w-fit">
                Create Collection
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default withUAL(CreateNewCollection);
