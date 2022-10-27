import { useState, useEffect } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import Image from 'next/image';
import { UploadSimple, CircleNotch } from 'phosphor-react';
import { Tab } from '@headlessui/react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { getCollectionService } from '@services/collection/getCollectionService';
import { editCollectionService } from '@services/collection/editCollectionService';
import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';

import { Table } from '@components/Table';
import { Input } from '@components/Input';
import { Textarea } from '@components/Textarea';

const informationValidations = yup.object().shape({
  displayName: yup.string().required().label('Display name'),
  website: yup.string().url().label('Website'),
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

function EditCollection({ ual, initialCollection }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [collection, setCollection] = useState(initialCollection);

  const {
    register,
    handleSubmit,
    watch,
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

  const image = watch('image');

  useEffect(() => {
    if (typeof image !== 'string' && image && image.length > 0) {
      handleImageSource(image[0]);
    }
  }, [image]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isSaved]);

  const handleImageSource = (img) => {
    if (img) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImageSrc(fileReader.result);
      };
      fileReader.readAsDataURL(img);
    }
  };

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
    image,
    displayName,
    website,
    description,
  }) {
    setIsLoading(true);

    const pinataImage =
      image.length > 0 && (await uploadImageToIpfsService(image[0]));

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
            key: 'url',
            value: ['string', website],
          },
          {
            key: 'img',
            value: ['string', pinataImage.IpfsHash ?? collection.img],
          },
        ],
      },
    });

    setIsLoading(false);

    if (editedInformation && editedInformation.status === 'executed') {
      setIsSaved(true);
    }
  }

  async function onSubmitMarketFee({ marketFee }) {
    setIsLoading(true);

    const data = {
      action: 'setmarketfee',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
        market_fee: marketFee / 100.0,
      },
    };

    const editedMarketFee = await editCollectionService(data);

    setIsLoading(false);

    if (editedMarketFee && editedMarketFee.status === 'executed') {
      setIsSaved(true);
    }
  }

  async function onSubmitAddAccountAuthorization({ account }) {
    setIsLoading(true);

    const data = {
      action: 'addcolauth',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
        account_to_add: account,
      },
    };

    const editedAuth = await editCollectionService(data);

    setIsLoading(false);

    if (editedAuth && editedAuth.status === 'executed') {
      setIsSaved(true);
      setCollection((state) => {
        state.authorized_accounts = [...state.authorized_accounts, account];
        return { ...state };
      });
    }
  }

  async function onSubmitRemoveAccountAuthorization(account) {
    setIsLoading(true);

    const data = {
      action: 'remcolauth',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
        account_to_remove: account,
      },
    };

    const editedAuth = await editCollectionService(data);

    setIsLoading(false);

    if (editedAuth && editedAuth.status === 'executed') {
      setIsSaved(true);
      setCollection((state) => {
        const accountIndex = state.authorized_accounts.findIndex(
          (item) => item === account
        );
        state.authorized_accounts.splice(accountIndex, 1);
        return { ...state };
      });
    }
  }

  async function onSubmitNotificationAccount({ account }) {
    setIsLoading(true);

    const data = {
      action: 'addnotifyacc',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
        account_to_add: account,
      },
    };

    const editedNotification = await editCollectionService(data);

    setIsLoading(false);

    if (editedNotification && editedNotification.status === 'executed') {
      setIsSaved(true);
      setCollection((state) => {
        state.notify_accounts = [...state.notify_accounts, account];
        return { ...state };
      });
    }
  }

  async function onSubmitRemoveNotificationAccount(account) {
    setIsLoading(true);

    const data = {
      action: 'remnotifyacc',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
        account_to_remove: account,
      },
    };

    const editedNotification = await editCollectionService(data);

    setIsLoading(false);

    if (editedNotification && editedNotification.status === 'executed') {
      setIsSaved(true);
      setCollection((state) => {
        const accountIndex = state.notify_accounts.findIndex(
          (item) => item === account
        );
        delete state.notify_accounts[accountIndex];
        return { ...state };
      });
    }
  }

  async function onSubmitNotify(event) {
    event.preventDefault();

    const data = {
      action: 'forbidnotify',
      activeUser: ual.activeUser,
      data: {
        collection_name: collection.collection_name,
      },
    };

    const editedNotification = await editCollectionService(data);

    setIsLoading(false);

    if (editedNotification && editedNotification.status === 'executed') {
      setIsSaved(true);
    }
  }

  if (collection) {
    return (
      <div className="container mx-auto pb-16 flex flex-col gap-4">
        <header className="py-16">
          <div className="container">
            <p className="headline-3 mb-2">Edit Collection</p>
            <h1 className="md:headline-1 headline-2">
              {collection.collection_name}
            </h1>
          </div>
        </header>
        <Tab.Group>
          <Tab.List className="tab-list -mt-14 mb-14">
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
                    className="w-80 h-80 flex flex-col justify-center items-center gap-md bg-neutral-800 rounded-xl overflow-hidden cursor-pointer p-md"
                  >
                    {imageSrc || collection.img ? (
                      <Image
                        src={imageSrc ?? `${ipfsEndpoint}/${collection.img}`}
                        width="320"
                        height="320"
                        objectFit="cover"
                        className="rounded-md"
                        alt=""
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center text-center p-4 gap-2">
                        <UploadSimple size={56} weight="bold" />
                        <p className="title-1">Add Collection Image</p>
                        <p className="body-3">
                          Transparent backgrounds are recommended
                        </p>
                      </div>
                    )}
                    <input
                      id="file"
                      {...register('image')}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex flex-col w-full gap-8">
                  <Input
                    type="text"
                    defaultValue={collection.collection_name}
                    label="collection Name"
                    readOnly
                    disabled
                    hint="Collection name cannot be edited."
                  />
                  <Input
                    {...register('displayName')}
                    error={errors.displayName?.message}
                    type="text"
                    defaultValue={collection.data.name}
                    label="Display Name"
                  />
                  <Input
                    {...register('website')}
                    error={errors.website?.message}
                    type="text"
                    defaultValue={collection.data.url}
                    label="Website"
                  />
                  <Textarea
                    {...register('description')}
                    error={errors.description?.message}
                    type="text"
                    defaultValue={collection.data.description}
                    label="Description"
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
                      maxLength="13"
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
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const { chainKey, collectionName } = context.params;

  const { data: collection } = await getCollectionService(chainKey, {
    collectionName,
  });

  return {
    props: {
      initialCollection: collection.data,
    },
  };
}

export default withUAL(EditCollection);
