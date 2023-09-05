import { useState, useRef, useEffect } from 'react';
import { withUAL } from 'ual-reactjs-renderer';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DiceFive, CircleNotch } from '@phosphor-icons/react';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { debounce } from '@utils/debounce';

import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { Switch } from '@components/Switch';
import { Textarea } from '@components/Textarea';
import { WarningCard } from '@components/WarningCard';

import chainsConfig from '@configs/chainsConfig';
import { appName } from '@configs/globalsConfig';

import * as utils from './utils/utils';
import { validationSchema } from './utils/validationSchema';
import {
  toolInfo,
  batchOptions,
  searchByOptions,
  dropAssetsOptions,
} from './config';

interface AirdropProps {
  ual: any;
}

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
}

interface TemplateDataProps {
  valid: boolean;
  template: {
    contract?: string;
    template_id?: string;
    is_transferable?: boolean;
    is_burnable?: boolean;
    issued_supply?: string;
    max_supply?: string;
    collection?: {
      collection_name: string;
      name: string;
      img: string;
      author: string;
      allow_notify: boolean;
      authorized_accounts: string[];
      notify_accounts: any[];
      market_fee: number;
      created_at_block: string;
      created_at_time: string;
    };
    schema?: {
      schema_name: string;
      format: {
        name: string;
        type: string;
      }[];
      created_at_block: string;
      created_at_time: string;
    };
    immutable_data?: {
      img: string;
      name: string;
      points: string;
      description: string;
    };
    created_at_time?: string;
    created_at_block?: string;
    name?: string;
  };
}

interface QueryData {
  chainKey?: string;
  collection?: string;
}

interface ActionsProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    authorized_creator: string;
    collection_name: string;
    schema_name: string;
    schema_format?: {
      name: string;
      type: string;
    }[];
    transferable?: boolean;
    burnable?: boolean;
    max_supply?: string;
    immutable_data?: {
      key: string;
      value: [string, any];
    }[];
  };
}

function Airdrop({ ual }: AirdropProps) {
  const modalRef = useRef(null);
  const router = useRouter();
  const { chainKey, collection }: QueryData = router.query;

  const [unique, setUnique] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState('');
  const [randomizing, setRandomizing] = useState(false);
  const [assetsToReward, setAssetsToReward] = useState([]);
  const [actions, setActions] = useState<ActionsProps[]>([]);
  const [templateIDsList, setTemplateIDsList] = useState('');
  const [accountsToReward, setAccountsToReward] = useState([]);
  const [queriedAssets, setQueriedAssets] = useState<string[]>([]);
  const [queriedAccounts, setQueriedAccounts] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<ActionsProps[]>([]);
  const [selectedDropAssetOption, setSelectedDropAssetOption] = useState('');
  const [selectedSearchByOption, setSelectedSearchByOption] = useState(
    searchByOptions[0].value
  );
  const [transactionBatch, setTransactionBatch] = useState(
    JSON.parse(localStorage.getItem('airdropTransactionBatch')) || []
  );
  const [selectedBatchSizeOption, setSelectedBatchSizeOption] = useState(
    batchOptions[0].value
  );
  const [hasRemainingTransactions, setHasRemainingTransactions] =
    useState(false);
  const [templateData, setTemplateData] = useState<TemplateDataProps>({
    valid: false,
    template: {},
  });
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
  });

  const chainIdLogged =
    ual?.activeUser?.chainId ?? ual?.activeUser?.chain.chainId;

  const chainId = chainsConfig[chainKey].chainId;

  const validation = validationSchema({
    queriedAccounts,
    queriedAssets,
    chainKey,
  });

  const {
    control,
    watch,
    register,
    setValue,
    setError,
    getValues,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
    shouldFocusError: true,
    reValidateMode: 'onBlur',
  });

  const watchRecipients = watch('recipients');
  const watchQuantity = watch('quantity');
  const watchAssets = watch('assets');
  const watchMemo = watch('memo');

  useEffect(() => {
    if (watchRecipients) {
      setAccountsToReward(watchRecipients.split(','));
    }
    if (watchAssets) {
      setAssetsToReward(watchAssets.split(','));
    }
  }, [watchRecipients, watchAssets]);

  useEffect(() => {
    if (actions.length > 0) {
      setTransactions(utils.breakArray(actions, selectedBatchSizeOption));
    }
  }, [actions, selectedBatchSizeOption]);

  useEffect(() => {
    if (transactionBatch.length > 0) {
      setHasRemainingTransactions(true);
    }
    localStorage.setItem(
      'airdropTransactionBatch',
      JSON.stringify(transactionBatch)
    );
  }, [transactionBatch]);

  useEffect(() => {
    if (accountsToReward.length > 0) {
      let accounts = [];

      accounts = unique
        ? utils.filterRepeatedElements(accountsToReward)
        : accountsToReward;

      const assetsList = assetsToReward ?? [];

      let actionsList = [];

      if (
        assetsList &&
        assetsList.length > 0 &&
        selectedDropAssetOption === 'assets'
      ) {
        actionsList = utils.handleAirdropByAssetID({
          ual,
          recipients: accounts,
          assets: assetsList,
          memo: watchMemo,
        });
      }

      if (
        templateData['template'] &&
        templateData['template'].template_id &&
        selectedDropAssetOption === 'template'
      ) {
        actionsList = utils.handleAirdropByTemplateID({
          ual,
          recipients: accounts,
          templateID: templateData['template'].template_id,
          collectionName:
            collection || templateData['template'].collection.collection_name,
          schemaName: templateData['template'].schema?.schema_name,
        });
      }

      setActions(actionsList);
    }
  }, [
    ual,
    watchMemo,
    unique,
    templateData,
    collection,
    assetsToReward,
    accountsToReward,
    selectedDropAssetOption,
  ]);

  useEffect(() => {
    setCollections('');
    setTemplateIDsList('');
    resetField('templateIDs');
    resetField('collections');
  }, [selectedSearchByOption, resetField]);

  async function findAccounts() {
    try {
      setLoading(true);

      const accounts = await utils.handleAccountsFilters({
        collections,
        search: selectedSearchByOption,
        templates: templateIDsList,
        chainKey,
        quantity: Number(watchQuantity),
        unique,
      });

      if (accounts.length > 0) {
        setValue('recipients', accounts.toString());
        setAccountsToReward(accounts);
        setQueriedAccounts(accounts);
      } else {
        modalRef.current?.openModal();
        setModal({
          title: 'Unable to find accounts',
          message:
            'There are no accounts to airdrop with the selected filters.',
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);

      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(error));
      const details = JSON.stringify(error, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to find accounts';

      setModal({
        title: 'Find accounts error',
        message,
        details,
      });
    }
  }

  async function findAssetsByTemplateId({ templateId }) {
    try {
      setLoading(true);
      const assets = await utils.handleAssets({
        accountName: ual.activeUser.accountName,
        chainKey,
        templateID: templateId,
      });

      setValue('assets', assets.toString());
      setQueriedAssets(assets);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(error));
      const details = JSON.stringify(error, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to find NFTs';

      setModal({
        title: 'Find NFTs error',
        message,
        details,
      });
    }
  }

  async function onSubmit() {
    try {
      if (transactions.length > 0) {
        localStorage.setItem(
          'airdropTransactionBatch',
          JSON.stringify(transactions)
        );

        let updatedBatch = [...transactions];

        for (const actions of transactions) {
          const result = await ual.activeUser.signTransaction(
            { actions },
            {
              blocksBehind: 3,
              expireSeconds: 60,
            }
          );

          if (result.status === 'executed') {
            updatedBatch = updatedBatch.filter((item) => item !== actions);
            setTransactionBatch(updatedBatch);
          }
        }

        modalRef.current?.openModal();
        const title = 'Airdrop was successful';
        const message = 'Please await while we refresh the page.';
        setModal({
          title,
          message,
        });
        setTimeout(() => {
          router.reload();
        }, 3000);

        localStorage.removeItem('airdropTransactionBatch');

        async function redirect() {
          router.push(`/${chainKey}/collection/${collection}`);
        }
        setTimeout(redirect, 8000);
      }
    } catch (error) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(error));
      const details = JSON.stringify(error, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to airdrop NFTs';

      setModal({
        title: 'Transaction error',
        message,
        details,
      });
    }
  }

  function handleLogin() {
    ual?.showModal();
  }

  if (!!chainId && !!chainIdLogged && chainId === chainIdLogged) {
    return (
      <div className="container flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="headline-1">{toolInfo.name}</h1>
          <span className="body-1">Bulk send NFTs with filters.</span>
        </div>
        {hasRemainingTransactions ? (
          <>
            {transactionBatch?.length > 0 && actions.length === 0 ? (
              <div className="flex flex-col gap-8">
                <WarningCard
                  title="Transaction Batch"
                  content="It appears that you have a batch of transactions that
                  weren't replicated to the chain. Select continue to
                  review imported data or clear to start a new import."
                  callback={() =>
                    utils.continueAirdropBatchTransactions({
                      transactionBatch,
                      setActions,
                    })
                  }
                  clear={() => {
                    localStorage.removeItem('airdropTransactionBatch'),
                      setHasRemainingTransactions(false);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-8">
                  <WarningCard
                    title="Transaction Batch"
                    content={`There is ${
                      transactionBatch.length > 1
                        ? `${transactionBatch.length} transactions remaining`
                        : `${transactionBatch.length} transaction remaining`
                    }, please proceed to Airdrop.`}
                  />
                </div>
                <button onClick={() => onSubmit()} className="btn w-fit">
                  {toolInfo.name}
                </button>
              </>
            )}
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-12"
          >
            <div className="flex flex-col gap-12">
              <div className="grid grid-flow-row grid-cols-12 gap-4 gap-y-8 border border-neutral-700 rounded-md p-8 justify-between">
                <div className="md:col-span-4 col-span-12">
                  <Select
                    onChange={(option) => setSelectedSearchByOption(option)}
                    label="Include accounts"
                    selectedValue={searchByOptions[0].value}
                    options={searchByOptions}
                  />
                </div>
                {(selectedSearchByOption === 'collection' ||
                  selectedSearchByOption === 'notHoldingTemplate') && (
                  <div className="md:col-span-4 col-span-12">
                    <Input
                      {...register('collections')}
                      type="text"
                      label={
                        selectedSearchByOption === 'notHoldingTemplate'
                          ? 'Holding collection'
                          : 'Holding any of the following collections'
                      }
                      placeholder={
                        selectedSearchByOption !== 'notHoldingTemplate'
                          ? 'Comma-separated'
                          : null
                      }
                      onChange={debounce(async (e) => {
                        await utils.checkIfCollectionExists({
                          chainKey,
                          collections: e.target.value,
                          field: 'collections',
                          setError,
                        });
                        setCollections(e.target.value);
                      }, 500)}
                      error={errors.collections && errors.collections.message}
                    />
                  </div>
                )}
                {(selectedSearchByOption === 'template' ||
                  selectedSearchByOption === 'notHoldingTemplate') && (
                  <div className="md:col-span-4 col-span-12">
                    <Input
                      {...register('templateIDs')}
                      type="text"
                      label={
                        selectedSearchByOption === 'notHoldingTemplate'
                          ? 'Not holding template ID'
                          : 'Holding any of the following template IDs'
                      }
                      placeholder={
                        selectedSearchByOption !== 'notHoldingTemplate'
                          ? 'Comma-separated'
                          : null
                      }
                      onChange={debounce(async (e) => {
                        await utils.handleTemplates({
                          chainKey,
                          templates: e.target.value,
                          field: 'templateIDs',
                          setError,
                        });
                        setTemplateIDsList(e.target.value);
                      }, 500)}
                      error={errors.templateIDs && errors.templateIDs.message}
                    />
                  </div>
                )}
                {selectedSearchByOption !== 'notHoldingTemplate' && (
                  <div className="md:col-span-4 col-span-12">
                    <Input
                      {...register('quantity')}
                      type="number"
                      label="Holding quantity"
                      defaultValue={1}
                    />
                  </div>
                )}
                <div className="md:col-span-5 col-span-12">
                  <Controller
                    control={control}
                    name="uniqueAccounts"
                    defaultValue={false}
                    render={() => (
                      <Switch
                        label="Unique accounts only"
                        onChange={setUnique}
                        checked={unique}
                      />
                    )}
                  />
                </div>
                <div className="col-span-12">
                  {!loading ? (
                    <button
                      className="btn w-fit"
                      type="button"
                      onClick={() => findAccounts()}
                      disabled={
                        !(templateIDsList || collections) ||
                        (selectedSearchByOption === 'notHoldingTemplate' &&
                          (collections.length === 0 ||
                            templateIDsList.length === 0))
                      }
                    >
                      Find accounts
                    </button>
                  ) : (
                    <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
                      <CircleNotch
                        size={24}
                        weight="bold"
                        className="animate-spin"
                      />
                      Loading...
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-end h-8">
                  <div className="flex flex-row gap-2">
                    <label className="body-2 font-bold">
                      Accounts to Airdrop
                    </label>
                    <span className="badge-small font-bold">{`${
                      accountsToReward && accountsToReward.length
                    }`}</span>
                  </div>
                  {accountsToReward.length > 1 && (
                    <button
                      type="button"
                      onClick={async () => {
                        setRandomizing(true);
                        await utils.randomizeArray({
                          array: accountsToReward,
                          field: 'recipients',
                          setValue,
                        });
                        setRandomizing(false);
                      }}
                      className="btn p-0.5 btn-ghost flex flex-row tooltip gap-2 items-center hover:last:block"
                    >
                      <DiceFive
                        size={24}
                        className={randomizing ? 'animate-spin' : null}
                      />
                      <span className="tooltip-text">Randomize accounts</span>
                    </button>
                  )}
                </div>
                <Controller
                  name="recipients"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      error={utils.convertErrorToString(errors.recipients)}
                      placeholder="Comma-separated"
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      hint={
                        queriedAccounts.length > 0 &&
                        'You may add additional accounts above separated by commas and no spaces. Example: nftflow,jumpnft,newgamer234'
                      }
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-8">
                <Select
                  onChange={(option) => setSelectedDropAssetOption(option)}
                  label="How do you want to Airdrop"
                  selectedValue={dropAssetsOptions[0].value}
                  options={dropAssetsOptions}
                />
                {selectedDropAssetOption === 'template' && (
                  <Input
                    {...register('templateID')}
                    type="text"
                    label="Template ID"
                    onChange={debounce(async (e) => {
                      await utils.handleTemplates({
                        chainKey,
                        collectionName: collection,
                        templates: e.target.value,
                        field: 'templateID',
                        setError,
                        callback: setTemplateData,
                      });
                    }, 500)}
                    error={errors.templateID && errors.templateID.message}
                  />
                )}
                {selectedDropAssetOption === 'assets' && (
                  <div className="flex flex-col gap-8">
                    <div
                      className={`flex flex-col md:flex-row gap-4 gap-y-8 border border-neutral-700 rounded-md p-8 justify-between items-start ${
                        errors.assetsByTemplateId &&
                        errors.assetsByTemplateId.message
                          ? 'md:items-center'
                          : 'md:items-end'
                      }`}
                    >
                      <Input
                        {...register('assetsByTemplateId')}
                        type="text"
                        className="w-full"
                        label="Find NFTs by Template ID"
                        onChange={debounce(async (e) => {
                          await utils.handleTemplates({
                            chainKey,
                            collectionName: collection,
                            templates: e.target.value,
                            field: 'assetsByTemplateId',
                            setError,
                            callback: setTemplateData,
                          });
                        }, 500)}
                        error={
                          errors.assetsByTemplateId &&
                          errors.assetsByTemplateId.message
                        }
                      />
                      {!loading ? (
                        <button
                          className="btn w-fit whitespace-nowrap"
                          type="button"
                          disabled={
                            !!(
                              errors.assetsByTemplateId &&
                              errors.assetsByTemplateId.message
                            )
                          }
                          onClick={() =>
                            findAssetsByTemplateId(
                              getValues('assetsByTemplateId')
                            )
                          }
                        >
                          Find NFTs
                        </button>
                      ) : (
                        <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
                          <CircleNotch
                            size={24}
                            weight="bold"
                            className="animate-spin"
                          />
                          Loading...
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between items-end h-8">
                        <div className="flex flex-row gap-2">
                          <label className="body-2 font-bold">
                            NFTs to Airdrop
                          </label>
                          <span className="badge-small font-bold">{`${assetsToReward.length}`}</span>
                        </div>
                        {assetsToReward.length > 1 && (
                          <button
                            type="button"
                            onClick={async () => {
                              setRandomizing(true);
                              await utils.randomizeArray({
                                array: assetsToReward,
                                field: 'assets',
                                setValue,
                              });
                              setRandomizing(false);
                            }}
                            className="btn p-0.5 btn-ghost flex flex-row tooltip gap-2 items-center hover:last:block"
                          >
                            <DiceFive
                              size={24}
                              className={randomizing && 'animate-spin'}
                            />
                            <span className="tooltip-text">Randomize NFTs</span>
                          </button>
                        )}
                      </div>
                      <Controller
                        name="assets"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            error={utils.convertErrorToString(errors.assets)}
                            placeholder="Comma-separated"
                            onChange={(event) => {
                              field.onChange(event.target.value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
                {selectedDropAssetOption && (
                  <>
                    <Select
                      onChange={(option) => setSelectedBatchSizeOption(option)}
                      label="Batch size"
                      selectedValue={batchOptions[0].value}
                      options={batchOptions}
                    />
                    {selectedDropAssetOption === 'assets' && (
                      <Input type="text" label="Memo" {...register('memo')} />
                    )}
                  </>
                )}
              </div>
            </div>
            {(accountsToReward.length > assetsToReward.length ||
              accountsToReward.length < assetsToReward.length) &&
              assetsToReward.length > 0 && (
                <WarningCard
                  title="Airdrop reward"
                  content={
                    accountsToReward.length > assetsToReward.length
                      ? `There are more recipients than NFTs. Only ${assetsToReward.length} accounts will receive an NFT.`
                      : `There are ${assetsToReward.length} NFTs and only ${accountsToReward.length} accounts. Some NFTs will not be distributed.`
                  }
                />
              )}
            {actions.length > Number(selectedBatchSizeOption) && (
              <WarningCard
                title="Transaction Batch"
                content={`This process was batched into ${Math.ceil(
                  actions.length / Number(selectedBatchSizeOption)
                )} transactions, this means you will have to sign each one of them.`}
              />
            )}
            <button
              className="btn w-fit"
              disabled={
                !selectedDropAssetOption ||
                (selectedDropAssetOption === 'assets'
                  ? assetsToReward.length === 0
                  : templateData.template &&
                    Object.keys(templateData.template).length === 0) ||
                loading
              }
            >
              {toolInfo.name}
            </button>
          </form>
        )}
        <Modal ref={modalRef} title={modal.title}>
          <p className="body-2 mt-2">{modal.message}</p>
          {modal.details && (
            <Disclosure>
              <Disclosure.Button className="btn btn-small mt-4">
                Details
              </Disclosure.Button>
              <Disclosure.Panel>
                <pre className="overflow-auto p-4 rounded-lg bg-neutral-700 max-h-96 mt-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: modal.details }}
                  ></div>
                </pre>
              </Disclosure.Panel>
            </Disclosure>
          )}
        </Modal>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Airdrop - ${appName}`}</title>
      </Head>

      {!ual?.activeUser && (
        <div className="mx-auto my-14 text-center">
          <h2 className="headline-2">Connect your wallet</h2>
          <p className="body-1 mt-2 mb-6">
            You need to connect your wallet to Airdrop NFTs
          </p>
          <button type="button" className="btn" onClick={handleLogin}>
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
}

export default withUAL(Airdrop);
