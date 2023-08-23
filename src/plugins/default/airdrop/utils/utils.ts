import seed from 'seed-random';

import { getAccountsService } from '../services/getAccountsService';
import { getRandomSeedService } from '../services/getRandomSeedService';
import { getInventoryService } from '@services/inventory/getInventoryService';
import { getCollectionService } from '@services/collection/getCollectionService';
import { collectionTemplatesService } from '@services/collection/collectionTemplatesService';

interface TemplateProps {
  chainKey: string;
  templates: string;
  collectionName?: string;
  callback?: (value) => void;
  setError?: any;
  field?: string;
}

interface CollectionExistsProps {
  chainKey: string;
  collections: string;
  setError: any;
  field: string;
}

interface RandomizeProps {
  array: string[];
  setValue: (prop1, prop2) => void;
  field: string;
}

interface HandleAccountsProps {
  collection?: string;
  template?: string;
  chainKey: string;
}

interface HandleAssetsProps {
  accountName: string;
  chainKey: string;
  templateID: string;
}

interface AccountsFiltersProps {
  collections: string;
  templates: string;
  chainKey: string;
  quantity: number;
  search: string;
  unique: boolean;
}

interface AirdropByAssetIDProps {
  ual: any;
  recipients: string[];
  assets: string[];
  memo: string;
}

interface AirdropByTemplateIDProps {
  ual: any;
  recipients: string[];
  templateID: string;
  schemaName: string;
  collectionName: string;
}

export async function handleTemplates({
  chainKey,
  templates,
  collectionName,
  callback,
  setError,
  field,
}: TemplateProps) {
  setError(field, {
    type: 'manual',
    message: '',
  });

  if (templates.length > 0) {
    const invalidTemplates = [];
    const validTemplates = [];
    const templatesArray = templates.split(',');

    for (const template of templatesArray) {
      try {
        const { data: templatesList } = await collectionTemplatesService(
          chainKey,
          {
            templateId: template,
            collectionName,
          }
        );

        if (templatesList.data.length > 0) {
          validTemplates.push(templatesList.data[0]);
        } else {
          invalidTemplates.push(template);
        }
      } catch (error) {
        invalidTemplates.push(template);
      }
    }

    if (invalidTemplates.length > 0) {
      setError(field, {
        type: 'manual',
        message: `Template ID #${invalidTemplates.toString()} is invalid.`,
      });
    }

    if (callback) {
      callback({
        valid: !!validTemplates,
        template: validTemplates ? validTemplates[0] : {},
      });
    }
  }

  return;
}

function shuffleArrayWithSeed(array, seedValue) {
  const random = seed(seedValue, { global: true });
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

export async function randomizeArray({
  array,
  setValue,
  field,
}: RandomizeProps) {
  try {
    const seed = await getRandomSeedService();
    if (!seed) return;

    const shuffledArray = shuffleArrayWithSeed(array, seed);
    setValue(field, shuffledArray.toString());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export function handleAirdropByAssetID({
  ual,
  recipients,
  assets,
  memo,
}: AirdropByAssetIDProps) {
  const newActions = [];

  recipients.forEach((account, index) => {
    if (assets[index]) {
      newActions.push({
        account: 'atomicassets',
        name: 'transfer',
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: ual.activeUser.requestPermission,
          },
        ],
        data: {
          from: ual.activeUser.accountName,
          to: account,
          asset_ids: [assets[index]],
          memo,
        },
      });
    }
  });

  return newActions;
}

export function handleAirdropByTemplateID({
  ual,
  recipients,
  templateID,
  schemaName,
  collectionName,
}: AirdropByTemplateIDProps) {
  const newActions = [];

  recipients.forEach((account) => {
    newActions.push({
      account: 'atomicassets',
      name: 'mintasset',
      authorization: [
        {
          actor: ual.activeUser.accountName,
          permission: ual.activeUser.requestPermission,
        },
      ],
      data: {
        authorized_minter: ual.activeUser.accountName,
        collection_name: collectionName,
        schema_name: schemaName,
        template_id: templateID,
        new_asset_owner: account,
        immutable_data: [],
        mutable_data: [],
        tokens_to_back: [],
      },
    });
  });

  return newActions;
}

export function breakArray(array: any[], size: string) {
  const length = array.length;
  const segmentLength = Number(size);
  const segments = [];

  for (let i = 0; i < length; i += segmentLength) {
    segments.push(array.slice(i, i + segmentLength));
  }

  return segments;
}

export function continueAirdropBatchTransactions({
  transactionBatch,
  setActions,
}) {
  const newActions = [];

  for (const transaction of transactionBatch) {
    for (const action of transaction) {
      newActions.push(action);
    }
  }

  setActions(newActions);
}

export function filterRepeatedElements(array: string[]) {
  const uniqueArray = [...new Set(array)];
  return uniqueArray;
}

export async function checkIfCollectionExists({
  chainKey,
  collections,
  setError,
  field,
}: CollectionExistsProps) {
  setError(field, {
    type: 'manual',
    message: '',
  });

  const invalidCollections = [];
  for (const collection of collections.split(',')) {
    try {
      await getCollectionService(chainKey, {
        collectionName: collection,
      });
    } catch (error) {
      invalidCollections.push(collection);
    }
    if (invalidCollections.length > 0) {
      setError(field, {
        type: 'manual',
        message: `Invalid collections: ${invalidCollections}`,
      });
    }
  }
}

export async function handleAccounts({
  collection,
  template,
  chainKey,
}: HandleAccountsProps) {
  const accounts = [];
  let currentPage = 1;

  while (true) {
    const { data: accountsList } = await getAccountsService(chainKey, {
      collectionName: collection,
      page: currentPage,
      templateID: template,
    });

    if (accountsList.data.length === 0) {
      break;
    }

    accounts.push(...accountsList.data);
    currentPage++;
  }

  return accounts;
}

export function convertErrorToString(error) {
  return typeof error === 'object' ? error.message : error;
}

export async function handleAccountsFilters({
  collections,
  templates,
  chainKey,
  quantity,
  search,
  unique,
}: AccountsFiltersProps) {
  const accounts = [];
  const newAccounts = [];
  const collectionsList = collections ? collections.split(',') : null;
  const templatesList = templates ? templates.split(',') : null;

  if (search !== 'notHoldingTemplate') {
    if (unique) {
      const result = await handleAccounts({
        collection: collections,
        template: templates,
        chainKey,
      });

      accounts.push(...result);
    } else {
      await Promise.all(
        (templatesList || collectionsList).map(async (element) => {
          const result = await handleAccounts({
            collection: collectionsList?.length > 0 ? element : '',
            template: templatesList?.length > 0 ? element : '',
            chainKey,
          });

          result.forEach((account) => {
            for (let i = 0; i < Number(account.assets); i++) {
              accounts.push(account);
            }
          });
        })
      );
    }
  } else {
    const collectionAccounts = [];
    const templateAccounts = [];

    const accountsByCollection = await handleAccounts({
      collection: collections,
      chainKey,
    });

    collectionAccounts.push(...accountsByCollection);

    const accountsByTemplate = await handleAccounts({
      template: templates,
      collection: collections,
      chainKey,
    });

    templateAccounts.push(...accountsByTemplate);

    const filteredAccounts = collectionAccounts.filter(
      (item) =>
        !templateAccounts.some((element) => item.account === element.account)
    );

    if (unique) {
      const uniqueAccounts = [...new Set(filteredAccounts)];
      accounts.push(...uniqueAccounts);
    } else {
      filteredAccounts.forEach((account) => {
        for (let i = 0; i < Number(account.assets); i++) {
          accounts.push(account);
        }
      });
    }
  }

  accounts.map((item) => {
    if (Number(item.assets) >= quantity) {
      newAccounts.push(item.account);
    }
  });

  return newAccounts;
}

export async function handleAssets({
  accountName,
  chainKey,
  templateID,
}: HandleAssetsProps) {
  const assets = [];
  let currentPage = 1;

  while (true) {
    const { data: inventory } = await getInventoryService(chainKey, {
      owner: accountName,
      template_id: templateID,
      page: currentPage,
      limit: 1000,
    });

    if (inventory.data.length === 0) {
      break;
    }

    inventory.data.map((asset) => {
      assets.push(asset.asset_id);
    });

    currentPage++;
  }

  return assets;
}
