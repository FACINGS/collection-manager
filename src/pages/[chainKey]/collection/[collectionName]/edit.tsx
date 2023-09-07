import { useState, useEffect, FormEvent, useRef } from 'react';
import { UploadSimple, CircleNotch } from '@phosphor-icons/react';
import { withUAL } from 'ual-reactjs-renderer';
import { GetServerSideProps } from 'next';
import { Tab, Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ipfsEndpoint, appName } from '@configs/globalsConfig';

import { editCollectionService } from '@services/collection/editCollectionService';
import {
  getCollectionService,
  CollectionProps,
} from '@services/collection/getCollectionService';

import { Table } from '@components/Table';
import { Input } from '@components/Input';
import { Textarea } from '@components/Textarea';
import { Header } from '@components/Header';
import { Select } from '@components/Select';
import { Modal } from '@components/Modal';

import { countriesList } from '@utils/countriesList';

const informationValidations = yup.object().shape({
  imageIpfsHash: yup.mixed()
    .test('imageIpfsHash', 'Image IPFS hash is required', (value) => {
      return value.startsWith('Qm') || value.startsWith('bafy');
    }),
  displayName: yup.string().required().label('Display name'),
  // website: yup.string().url().label('Website'),
  description: yup.string(),
});

const marketFeeValidations = yup.object().shape({
  marketFee: yup
    .number()
    .typeError('Must be between 0% and 15%. Only numbers.')
    .min(0, 'Must be between 0% and 15%.')
    .max(15, 'Must be between 0% and 15%.')
    .label('Market fee'),
});

const authorizationValidations = yup.object().shape({
  account: yup.string().eosName(),
});

const notificationValidations = yup.object().shape({
  account: yup.string().eosName(),
});

interface InformationProps {
  imageIpfsHash: string;
  displayName: string;
  description: string;
  socials: SocialProps;
}

interface SocialProps {
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  instagram?: string;
  youtube?: string;
  snipverse?: string;
  medium?: string;
}

interface EditCollectionProps {
  ual: any;
  initialCollection: CollectionProps;
  chainKey: string;
}

interface AccountProps {
  account: string;
}

interface MarketFeeProps {
  marketFee: number;
}

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
  isError?: boolean;
}

function EditCollection({
  ual,
  initialCollection,
  chainKey,
}: EditCollectionProps) {
  const router = useRouter();
  const modalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [collection, setCollection] = useState(initialCollection);
  const [previewImageSrc, setPreviewImageSrc] = useState(collection.img ? `${ipfsEndpoint}/${collection.img}` : null);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
    isError: false,
  });

  const socials = collection.data.url && collection.data.url.includes('\n') ? collection.data.url.split('\n').map((line) => {
    if (line.includes('https:') || line.includes('www.')) {
      const colonIndex = line.indexOf(':', line.indexOf('https:') > -1 ? 6 : 5);
      const platform = line.substring(0, colonIndex);
      let url = line.substring(colonIndex + 1);
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      return { platform, url };
    }
    return null;
  }).filter((item) => item !== null) : [];

  // this will be used in the future most likely. at this point we stick to the status quo on XPR Network 
  //
  // const creatorInfo =
  //   collection.data.creator_info && JSON.parse(collection.data.creator_info);
  // const socials =
  //   collection.data.socials && JSON.parse(collection.data.socials);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(informationValidations),
  });

  const {
    register: registerMarketFee,
    formState: { errors: marketFeeErrors },
    handleSubmit: handleSubmitMarketFee,
  } = useForm({
    resolver: yupResolver(marketFeeValidations),
  });

  const {
    register: registerAuthorization,
    formState: { errors: authorizationErrors },
    handleSubmit: handleSubmitAuthorization,
  } = useForm({
    resolver: yupResolver(authorizationValidations),
  });

  const {
    register: registerNotification,
    formState: { errors: notificationErrors },
    handleSubmit: handleSubmitNotifications,
  } = useForm({
    resolver: yupResolver(notificationValidations),
  });

  const imageIpfsHash = watch('imageIpfsHash');

  useEffect(() => {
    if (
      imageIpfsHash &&
      (imageIpfsHash.startsWith('Qm') || imageIpfsHash.startsWith('bafy'))
    ) {
      setPreviewImageSrc(`${ipfsEndpoint}/${imageIpfsHash}`);
    } else {
      setPreviewImageSrc(null);
    }
  }, [imageIpfsHash]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  if (!ual?.activeUser || ual?.activeUser?.accountName !== collection?.author) {
    return (
      <>
        {collection ? (
          <div className="container mx-auto px-8 py-24 text-center">
            <h4 className="headline-3">
              You don't have authorization to edit this collection.
            </h4>
          </div>
        ) : (
          <div className="container mx-auto flex justify-center py-32">
            <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
              <CircleNotch size={24} weight="bold" className="animate-spin" />
              Loading...
            </span>
          </div>
        )}
      </>
    );
  }

  async function onSubmitInformation({
    imageIpfsHash,
    displayName,
    description,
    website,
    telegram,
    twitter,
    instagram,
    discord,
    youtube,
    snipverse,
    medium,
  }: InformationProps & SocialProps) {
    setIsLoading(true);

    try {
      const socialLinks = [
        { name: 'website', link: website },
        { name: 'twitter', link: twitter },
        { name: 'telegram', link: telegram },
        { name: 'instagram', link: instagram },
        { name: 'youtube', link: youtube },
        { name: 'discord', link: discord },
        { name: 'snipverse', link: snipverse },
        { name: 'medium', link: medium },
      ];

      const socials = socialLinks
        .map((link) => {
          const trimmedLink = link.link ? link.link.trim().replace(/\/+$/, '') : '';
          return `${link.name}:${trimmedLink}`;
        })
        .join('\n');

      const editedInformation = await editCollectionService({
        action: 'setcoldata',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
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
              key: 'img',
              value: ['string', imageIpfsHash],
            },
            {
              key: 'url',
              value: ['string', `${socials}\n`],
            },
          ],
        },
      });

      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to edit collection';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitMarketFee({ marketFee }: MarketFeeProps) {
    setIsLoading(true);

    try {
      await editCollectionService({
        action: 'setmarketfee',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
          market_fee: marketFee / 100.0,
        },
      });

      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to edit collection market fee';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitAddAccountAuthorization({ account }: AccountProps) {
    setIsLoading(true);

    try {
      await editCollectionService({
        action: 'addcolauth',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
          account_to_add: account,
        },
      });

      setIsSaved(true);

      setCollection((state) => {
        state.authorized_accounts = [...state.authorized_accounts, account];
        return { ...state };
      });

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to add account to authorization list';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitRemoveAccountAuthorization(account: string) {
    setIsLoading(true);

    try {
      await editCollectionService({
        action: 'remcolauth',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
          account_to_remove: account,
        },
      });

      setIsSaved(true);

      setCollection((state) => {
        const accountIndex = state.authorized_accounts.findIndex(
          (item) => item === account
        );
        state.authorized_accounts.splice(accountIndex, 1);
        return { ...state };
      });

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to remove account from authorization list';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitNotificationAccount({ account }: AccountProps) {
    setIsLoading(true);

    try {
      await editCollectionService({
        action: 'addnotifyacc',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
          account_to_add: account,
        },
      });

      setIsSaved(true);

      setCollection((state) => {
        state.notify_accounts = [...state.notify_accounts, account];
        return { ...state };
      });

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to add account to notification list';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitRemoveNotificationAccount(account: string) {
    setIsLoading(true);

    try {
      await editCollectionService({
        action: 'remnotifyacc',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
          account_to_remove: account,
        },
      });

      setIsSaved(true);

      setCollection((state) => {
        const accountIndex = state.notify_accounts.findIndex(
          (item) => item === account
        );
        delete state.notify_accounts[accountIndex];
        return { ...state };
      });

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to remove account from notification list';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  async function onSubmitNotify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await editCollectionService({
        action: 'forbidnotify',
        activeUser: ual.activeUser,
        data: {
          collection_name: collection.collection_name,
        },
      });

      setIsSaved(true);

      modalRef.current?.openModal();
      const title = 'Notifications were forbidden';
      const message = 'Please wait while we reload the page.';

      setModal({
        title,
        message,
      });

      setTimeout(() => {
        router.reload();
        setIsSaved(false);
      }, 3000);
    } catch (e) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(e));
      const details = JSON.stringify(e, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to forbid notifications';

      setModal({
        title: 'Error',
        message,
        details,
        isError: true,
      });
    }
    setIsLoading(false);
  }

  function handlePrependHttps(event) {
    const { value } = event.target;

    if (
      !value.startsWith('https://') &&
      event.nativeEvent.inputType !== 'deleteContentBackward'
    ) {
      return 'https://' + value;
    }

    return value;
  }

  if (collection) {
    return (
      <>
        <Head>
          <title>{`Update ${collection.collection_name} - ${appName}`}</title>
        </Head>
        <Header.Root
          breadcrumb={[
            ['My Collections', `/${chainKey}`],
            [
              collection.collection_name,
              `/${chainKey}/collection/${collection.collection_name}`,
            ],
            ['Update Collection'],
          ]}
        >
          <Header.Content title={collection.collection_name} />
        </Header.Root>

        <Modal ref={modalRef} title={modal.title}>
          <p className="body-2 mt-2">{modal.message}</p>
          {modal.details && (
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

        <Tab.Group>
          <Tab.List className="tab-list mb-4 md:mb-8">
            <Tab className="tab">Information</Tab>
            <Tab className="tab">Market Fee</Tab>
            <Tab className="tab">Authorization</Tab>
            <Tab className="tab">Notifications</Tab>
            <Tab className="tab">Advanced</Tab>
          </Tab.List>
          <Tab.Panels className="container">
            <Tab.Panel>
              <form
                onSubmit={handleSubmit(onSubmitInformation)}
                className="flex md:flex-row flex-col gap-8 w-full md:items-start items-center"
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="file"
                    className="w-80 h-80 flex flex-col justify-center items-center gap-md bg-neutral-800 rounded-xl overflow-hidden p-4"
                  >
                    {previewImageSrc ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={previewImageSrc}
                          fill
                          className="object-contain"
                          alt=""
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-full h-full flex flex-col justify-center items-center gap-2 ${
                          errors.imageIpfsHash?.message
                            ? 'text-red-600'
                            : 'text-center'
                        }`}
                      >
                        <p className="title-1">Collection Image Preview</p>
                        <p className="body-3">
                          Will be shown if you provide a valid IPFS hash in the form.
                          <br />
                          Transparent backgrounds are recommended.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex flex-col w-full gap-8">
                  <Input
                    type="text"
                    defaultValue={collection.collection_name}
                    label="Collection ID"
                    readOnly
                    disabled
                    hint="Collection ID cannot be edited."
                  />
                  <Input
                    {...register('displayName')}
                    error={errors.displayName?.message}
                    type="text"
                    defaultValue={collection.data.name}
                    label="Name"
                  />
                  <Input
                    {...register('imageIpfsHash')}
                    error={errors.imageIpfsHash?.message}
                    type="text"
                    defaultValue={collection.img}
                    label="Image (IPFS Hash)"
                  />
                  <Input
                    {...register('website')}
                    error={errors.website?.message}
                    type="text"
                    defaultValue={socials?.find((item) => item.platform === 'website')?.url ?? ''}
                    label="Website"
                  />
                  <Textarea
                    {...register('description')}
                    error={errors.description?.message}
                    defaultValue={collection.data.description}
                    label="Description"
                  />

                  <div className="flex flex-col gap-8 mt-4">
                    <div className="flex flex-row gap-2 items-baseline">
                      <span className="title-1">Social Media</span>
                      <span className="body-1">(optional)</span>
                    </div>
                    <Controller
                      control={control}
                      name="twitter"
                      defaultValue={socials?.find((item) => item.platform === 'twitter')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Twitter"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://twitter.com/@handle"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="telegram"
                      defaultValue={socials?.find((item) => item.platform === 'telegram')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Telegram"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://t.me/username"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="discord"
                      defaultValue={socials?.find((item) => item.platform === 'discord')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Discord"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://discord.gg/invite/channel"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="snipverse"
                      defaultValue={socials?.find((item) => item.platform === 'snipverse')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Snipverse"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://snipverse.com/username"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="instagram"
                      defaultValue={socials?.find((item) => item.platform === 'instagram')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Instagram"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://www.instagram.com/username"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="youtube"
                      defaultValue={socials?.find((item) => item.platform === 'youtube')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Youtube"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://youtube.com/channel/channelurl"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="facebook"
                      defaultValue={socials?.find((item) => item.platform === 'facebook')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Facebook"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://facebook.com/pageurl"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="medium"
                      defaultValue={socials?.find((item) => item.platform === 'medium')?.url ?? ''}
                      render={({ field }) => (
                        <Input
                          label="Medium"
                          value={field.value}
                          onChange={(event) => {
                            const value = handlePrependHttps(event);
                            field.onChange(value);
                          }}
                          type="text"
                          placeholder="https://medium.com/@username"
                        />
                      )}
                    />
                  </div>
                  {/* <div className="flex flex-col gap-8 mt-4">
                    <div className="flex flex-row gap-2 items-baseline">
                      <span className="title-1">Company Details</span>
                      <span className="body-1">(optional)</span>
                    </div>
                    <Input
                      {...register('company')}
                      label="Company"
                      type="text"
                      defaultValue={creatorInfo?.company}
                      placeholder="e.g: Facings"
                    />
                    <Input
                      {...register('registrationNumber')}
                      label="Registration number"
                      type="number"
                      defaultValue={creatorInfo?.registration_number}
                      placeholder="e.g: 123456"
                    />
                    <Input
                      {...register('name')}
                      label="Name of Owner / Managing Director"
                      type="text"
                      defaultValue={creatorInfo?.name}
                      placeholder="e.g: John Doe"
                    />
                    <Controller
                      control={control}
                      name="country"
                      defaultValue={creatorInfo?.country}
                      render={({ field }) => (
                        <Select
                          label="Country"
                          onChange={field.onChange}
                          selectedValue={field.value}
                          options={countriesList}
                          placeholder="Select a country"
                        />
                      )}
                    />
                    <Input
                      {...register('address')}
                      label="Address"
                      type="text"
                      defaultValue={creatorInfo?.address}
                      placeholder="e.g: Gluthstrasse 8"
                    />
                    <Input
                      {...register('city')}
                      label="City"
                      type="text"
                      defaultValue={creatorInfo?.city}
                      placeholder="e.g: Munich"
                    />
                    <Input
                      {...register('zipCode')}
                      label="Zip code / Postal Code"
                      type="number"
                      defaultValue={creatorInfo?.zipCode}
                      placeholder="e.g: 80803"
                    />
                  </div> */}

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
                      className={`btn w-fit ${
                        isSaved && 'animate-pulse bg-emerald-600'
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Update collection'}
                    </button>
                  )}
                </div>
              </form>
            </Tab.Panel>

            <Tab.Panel>
              <form
                onSubmit={handleSubmitMarketFee(onSubmitMarketFee)}
                className="flex flex-col gap-8 w-full"
              >
                <Input
                  {...registerMarketFee('marketFee')}
                  error={marketFeeErrors.marketFee?.message}
                  type="number"
                  defaultValue={(collection.market_fee * 100.0).toFixed(2)}
                  label="Market fee"
                  hint="Must be between 0% and 15%."
                  min="0"
                  max="15"
                  step="0.1"
                />
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
                    className={`btn w-fit ${
                      isSaved && 'animate-pulse bg-emerald-600'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Update Market Fee'}
                  </button>
                )}
              </form>
            </Tab.Panel>

            <Tab.Panel>
              <div className="flex flex-col gap-8 w-full md:items-start items-center">
                <div className="flex flex-col gap-2">
                  <span className="headline-3">Authorized Accounts</span>
                  <span className="body-2 text-gray-300">
                    only the accounts within this list will be able to create
                    and edit assets.
                  </span>
                </div>
                {collection.authorized_accounts.length > 0 ? (
                  <Table
                    list={collection.authorized_accounts}
                    exception={collection.author}
                    action={onSubmitRemoveAccountAuthorization}
                  />
                ) : (
                  <div className="bg-neutral-800 px-8 py-16 text-center rounded-xl w-full">
                    <h4 className="title-1">
                      There are no authorized accounts.
                    </h4>
                  </div>
                )}
                <form
                  onSubmit={handleSubmitAuthorization(
                    onSubmitAddAccountAuthorization
                  )}
                  className="flex md:flex-row gap-4 w-full md:items-start items-center"
                >
                  <div className="flex flex-col w-full gap-4 justify-center mb-8">
                    <Input
                      {...registerAuthorization('account')}
                      error={authorizationErrors.account?.message}
                      type="text"
                      label="Account name"
                      maxLength={13}
                    />
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
                        className={`btn w-fit whitespace-nowrap ${
                          isSaved && 'animate-pulse bg-emerald-600'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Add account'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              {collection.allow_notify ? (
                <div className="flex flex-col gap-8 w-full md:items-start items-center">
                  <span className="headline-3">Notified Accounts</span>
                  {collection.notify_accounts.length > 0 ? (
                    <Table
                      list={collection.notify_accounts}
                      action={onSubmitRemoveNotificationAccount}
                    />
                  ) : (
                    <div className="bg-neutral-800 px-8 py-16 text-center rounded-xl w-full">
                      <h4 className="title-1">
                        There is no accounts to notify.
                      </h4>
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmitNotifications(
                      onSubmitNotificationAccount
                    )}
                    className="flex md:flex-row gap-4 w-full md:items-start items-center"
                  >
                    <div className="flex flex-col w-full gap-4 justify-center mb-8">
                      <Input
                        {...registerNotification('account')}
                        error={notificationErrors.account?.message}
                        type="text"
                        label="Account name"
                      />
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
                          className={`btn w-fit whitespace-nowrap ${
                            isSaved && 'animate-pulse bg-emerald-600'
                          }`}
                        >
                          {isSaved ? 'Saved' : 'Add account'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                  <h4 className="title-1">Notifications were forbidden.</h4>
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel>
              {collection.allow_notify ? (
                <div className="flex flex-col gap-4 w-full md:items-start items-center">
                  <form
                    onSubmit={onSubmitNotify}
                    className="flex flex-col gap-8 w-full md:items-start items-center"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="headline-3 whitespace-nowrap">
                        Forbid Notify
                      </span>
                      <span className="body-2 text-gray-300">
                        Only possible if the "Notified Accounts" list is empty.
                        Notify is enabled by default.
                      </span>
                      <span className="body-2 text-gray-300">
                        Notifications are required by certain Dapps to work
                        properly. However, the same system could also be abused;
                        for example, to block transfers, against the user's
                        will.
                      </span>
                      <span className="body-2 text-amber-400">
                        This action can not be undone, please be sure you want
                        to forbid notify.
                      </span>
                    </div>
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
                        className={`btn w-fit whitespace-nowrap ${
                          isSaved && 'animate-pulse bg-emerald-600'
                        }`}
                        disabled={collection.notify_accounts.length > 0}
                      >
                        {isSaved ? 'Saved' : 'Forbid Notify'}
                      </button>
                    )}
                  </form>
                </div>
              ) : (
                <div className="bg-neutral-800 px-8 py-24 text-center rounded-xl">
                  <h4 className="title-1">Notifications were forbidden.</h4>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const chainKey = context.params.chainKey as string;
  const collectionName = context.params.collectionName as string;

  const { data: collection } = await getCollectionService(chainKey, {
    collectionName,
  });

  return {
    props: {
      initialCollection: collection.data,
      chainKey,
    },
  };
};

export default withUAL(EditCollection);
