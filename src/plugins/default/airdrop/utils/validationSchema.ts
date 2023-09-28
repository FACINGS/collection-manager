import * as yup from 'yup';
import { getAccountsService } from '../services/getAccountsService';
import { getAssetService } from '@services/asset/getAssetService';

interface ValidationProps {
  queriedAccounts?: string[];
  queriedAssets?: string[];
  chainKey: string;
}

export function validationSchema({
  queriedAccounts,
  queriedAssets,
  chainKey,
}: ValidationProps) {
  return yup.object().shape({
    recipients: yup
      .string()
      .required('Account is required')
      .test({
        name: 'comma-separated',
        message: 'Invalid Account',
        test: async function (value: string) {
          if (!value) {
            return true;
          }

          const elements = value.split(',').map((element) => element.trim());
          const invalidAccounts = [];
          const accounts = [...new Set(elements)];

          await Promise.all(
            accounts.map(async (account) => {
              if (!queriedAccounts.includes(account)) {
                try {
                  const { data: accountData } = await getAccountsService(
                    chainKey,
                    {
                      owner: account,
                    }
                  );

                  if (accountData.data.length === 0) {
                    throw new Error('Data is empty or falsy');
                  }
                } catch (error) {
                  invalidAccounts.push(account);
                }
              }
            })
          );

          if (invalidAccounts.length > 0) {
            return this.createError({
              message: `"${invalidAccounts}" is an invalid account`,
              path: this.path,
            }) as boolean | yup.ValidationError;
          }

          return true;
        },
      }),
    assets: yup.string().test({
      name: 'comma-separated',
      message: 'Invalid NFT ID',
      test: async function (value: string) {
        if (!value) {
          return true;
        }

        const elements = value.split(',').map((element) => element.trim());
        const invalidAssets = [];
        const assets = [...new Set(elements)];

        await Promise.all(
          assets.map(async (asset) => {
            if (!queriedAssets.includes(asset)) {
              try {
                await getAssetService(chainKey, {
                  assetId: asset,
                });
              } catch (error) {
                invalidAssets.push(asset);
              }
            }
          })
        );

        if (invalidAssets.length > 0) {
          return this.createError({
            message: `"${invalidAssets}" is an invalid asset ID`,
            path: this.path,
          }) as boolean | yup.ValidationError;
        }

        return true;
      },
    }),
    memo: yup.string(),
  });
}
