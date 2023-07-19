import { useState, useRef, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import { WarningCircle } from 'phosphor-react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  pluginInfo,
  breakArray,
  clearBatch,
  batchOptions,
  validateDataType,
  checkIfSchemaExists,
  suggestionDataTypes,
  continueImportBatchTransactions,
} from './config';
import { Review } from './review';

import { Modal } from '@components/Modal';
import { Select } from '@components/Select';

import { handleAttributesData } from '@utils/handleAttributesData';

const csv = yup.object().shape({
  csvFile: yup.mixed().required(),
});

interface ModalProps {
  title: string;
  message?: string;
  details?: string;
}

interface ImportProps {
  ual: any;
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

interface SchemaAttributesProps {
  name: string;
  type: string;
}

interface ImportErrorsProps {
  index: number;
  type?: string;
  property?: string;
  title?: string;
  message: string;
}

interface RowsProps {
  [key: string]: any;
}

interface TemplateProps {
  [key: string]: any;
}

interface ValidationProps {
  [key: string]: any;
}

interface HintsProps {
  title: string;
  message: string;
}

function Import({ ual }: ImportProps) {
  const modalRef = useRef(null);
  const router = useRouter();

  const { chainKey, collectionName } = router.query;

  const [rows, setRows] = useState<RowsProps[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [attributes, setAttributes] = useState<String[]>([]);
  const [actions, setActions] = useState<ActionsProps[]>([]);
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const [importErrors, setImportErrors] = useState<ImportErrorsProps[]>([]);
  const [dataTypes, setDataTypes] = useState<ValidationProps>({});
  const [required, setRequired] = useState<ValidationProps>({});
  const [uniques, setUniques] = useState<ValidationProps>({});
  const [hints, setHints] = useState<HintsProps[]>([]);
  const [headersLength, setHeadersLength] = useState(0);
  const [schemaAttributes, setSchemaAttributes] = useState<
    SchemaAttributesProps[]
  >([]);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [transactionBatch, setTransactionBatch] = useState(
    JSON.parse(localStorage.getItem('transactionBatch')) || []
  );
  const [hasRemainingTransactions, setHasRemainingTransactions] =
    useState(false);
  const [selectedBatchSizeOption, setSelectedBatchSizeOption] = useState('25');
  const [existentSchemaInfo, setExistentSchemaInfo] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(csv),
  });

  useEffect(() => {
    if (actions.length > 0) {
      setTransactions(breakArray(actions, selectedBatchSizeOption));
    }
  }, [actions, selectedBatchSizeOption]);

  useEffect(() => {
    if (transactions.length > 0 && importErrors.length === 0) {
      localStorage.setItem('transactionBatch', JSON.stringify(transactions));
    }
  }, [transactions, importErrors]);

  useEffect(() => {
    if (transactionBatch.length > 0) {
      setHasRemainingTransactions(true);
    }
    localStorage.setItem('transactionBatch', JSON.stringify(transactionBatch));
  }, [transactionBatch]);

  async function onSubmit() {
    try {
      if (transactions.length > 0) {
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
        const title = 'Import was successful';
        const message = 'Please wait while we redirect you.';
        setModal({
          title,
          message,
        });

        localStorage.removeItem('transactionBatch');

        async function redirect() {
          router.push(`/${chainKey}/collection/${collectionName}`);
        }
        setTimeout(redirect, 8000);
      }
    } catch (error) {
      modalRef.current?.openModal();
      const jsonError = JSON.parse(JSON.stringify(error));
      const details = JSON.stringify(error, undefined, 2);
      const message =
        jsonError?.cause?.json?.error?.details[0]?.message ??
        'Unable to import schema';

      setModal({
        title: 'Transaction error',
        message,
        details,
      });
    }
  }

  useEffect(() => {
    if (
      fileName &&
      !fileName.match(/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/)
    ) {
      setImportErrors((state) => [
        ...state,
        ...[
          {
            index: 0,
            title: 'Invalid schema',
            message:
              'The file name is used to define the name of the schema and it must be up to 12 characters (a-z, 1-5, .) and cannot end with a "."',
          },
        ],
      ]);
    }
  }, [fileName]);

  useEffect(() => {
    // Checks if schema has at least one attribute img or video.
    if (attributes.length > 0 && !attributes.includes('img' || 'video')) {
      setImportErrors((state) => [
        ...state,
        ...[
          {
            index: 0,
            title: 'Invalid schema',
            message:
              'Your schema must contain at least one "img" or "video" attribute.',
          },
        ],
      ]);
    }

    const attributesData = [];
    const defaultHeaders = [
      'max_supply',
      'burnable',
      'transferable',
      'sysflag',
    ];
    const attributeTypeOptions = [
      'bool',
      'ipfs',
      'float',
      'image',
      'string',
      'double',
      'int8',
      'int16',
      'int32',
      'int64',
      'uint8',
      'uint16',
      'uint32',
      'uint64',
    ];

    // Checks if any of the schema attributes are invalid.
    if (dataTypes) {
      for (const element in dataTypes) {
        if (!attributeTypeOptions.includes(dataTypes[element])) {
          if (dataTypes[element] && element !== 'sysflag') {
            setImportErrors((state) => [
              ...state,
              ...[
                {
                  index: 0,
                  title: 'Invalid datatype',
                  message: `Property "${element}" has an invalid datatype "${dataTypes[element]}"`,
                },
              ],
            ]);
          }
        }
      }
    }

    attributes.map((attribute) => {
      attributesData.push({
        name: attribute,
        type: dataTypes[`${attribute}`],
      });
    });

    setSchemaAttributes(attributesData);

    const templateRows = rows
      .filter((row) => {
        const keys = Object.keys(rows[0]);

        if (keys.every((key) => row[key] === null)) {
          return false;
        }

        for (const key in row) {
          if (
            key === null ||
            (!attributes.includes(key) && !defaultHeaders.includes(key)) ||
            key === 'sysflag'
          ) {
            delete row[key];
          }
        }

        const values = Object.values(row).filter((val) => val !== null);

        if (values.length === 0) {
          return false;
        }

        return true;
      })
      .splice(headersLength);

    const suggestions = suggestionDataTypes({
      dataTypes: dataTypes,
      templates: templateRows,
    });

    if (suggestions) {
      setHints(suggestions);
    }

    // Checks if there is a missing property at the CSV.
    templateRows.map((row, index) => {
      for (const key in row) {
        if (key === '' && row[key]) {
          console.log(row[key]);
          setImportErrors((state) => [
            ...state,
            ...[
              {
                index: index,
                title: 'Missing property',
                message: `There is an empty property with a value at row "${
                  index + headersLength + 1
                }" of the CSV.`,
              },
            ],
          ]);
        }
      }
    });

    // Checks if a unique attribute is duplicated.
    if (uniques) {
      Object.keys(uniques).filter((item) => {
        if (uniques[item] && item !== 'sysflag') {
          const duplicates = [];
          const seenValues = {};
          const rowsWithDuplicates = [];

          templateRows.forEach((element) => {
            const value = element[item];
            if (seenValues[value]) {
              if (duplicates.indexOf(value) === -1) {
                duplicates.push(value);
              }
            } else {
              seenValues[value] = true;
            }
          });

          templateRows.filter((element, index) => {
            const value = element[item];
            const templateRowIndex = index + 1;
            if (duplicates.indexOf(value) !== -1) {
              rowsWithDuplicates.push(templateRowIndex + headersLength + 1);
            }
          });

          if (duplicates.length > 0 && rowsWithDuplicates.length > 0) {
            function formatRowsWithDuplicates(numbers) {
              if (numbers.length === 1) return numbers[0].toString();
              return (
                numbers.slice(0, -1).join(', ') +
                (numbers.length > 2 ? ',' : '') +
                ' and ' +
                numbers[numbers.length - 1]
              );
            }

            rowsWithDuplicates.forEach((rowIndex) => {
              setImportErrors((state) => [
                ...state,
                ...[
                  {
                    index: rowIndex - headersLength - 1,
                    title: 'Unique property',
                    message: `Property "${item}" has the value "${
                      duplicates[0]
                    }" repeated at rows "${formatRowsWithDuplicates(
                      rowsWithDuplicates
                    )}" of the CSV.`,
                  },
                ],
              ]);
            });
          }
        }
      });
    }

    templateRows.map((template, index) => {
      let newTemplate = {};
      const templateRowIndex = index + 1;

      // Checks if a required attribute is empty.
      Object.keys(template).map((item) => {
        if (required[item] && !template[item]) {
          setImportErrors((state) => [
            ...state,
            ...[
              {
                index: templateRowIndex,
                type: 'required',
                property: item,
                title: 'Required property',
                message: `Missing required attribute "${item}" at row "${
                  templateRowIndex + headersLength + 1
                }" of the CSV.`,
              },
            ],
          ]);
        }

        if (!defaultHeaders.includes(item) && attributesData.length > 0) {
          const { type } = attributesData.filter(
            (element) => element.name === item
          )[0];

          newTemplate = {
            ...newTemplate,
            ...{
              [item]: {
                value: template[item],
                type: type,
              },
            },
          };
        } else {
          newTemplate = { ...newTemplate, ...{ [item]: template[item] } };
        }
      });

      setTemplates((state) => [...state, ...[newTemplate]]);
    });
  }, [rows, attributes, dataTypes, required, uniques, headersLength]);

  useEffect(() => {
    async function handleActions() {
      if (
        fileName &&
        collectionName &&
        ual &&
        templates.length > 0 &&
        schemaAttributes.length > 0
      ) {
        const newActions = [];
        const schemaInfo = await checkIfSchemaExists({
          chainKey,
          collectionName,
          schemaName: fileName,
        });

        if (!schemaInfo.status) {
          const createSchema = {
            account: 'atomicassets',
            name: 'createschema',
            authorization: [
              {
                actor: ual.activeUser.accountName,
                permission: ual.activeUser.requestPermission,
              },
            ],
            data: {
              authorized_creator: ual.activeUser.accountName,
              collection_name: collectionName,
              schema_name: fileName,
              schema_format: schemaAttributes,
            },
          };

          newActions.push(createSchema);
        } else {
          setExistentSchemaInfo(schemaInfo);
        }

        await templates.map(async (template, index) => {
          const immutableDataList = [];
          const immutableAttributes = {};

          for (const key in template) {
            if (
              key !== 'burnable' &&
              key !== 'max_supply' &&
              key !== 'transferable'
            ) {
              const attributeError = validateDataType({
                data: template[key],
                attribute: key,
                index: index,
                headersLength: headersLength + 1,
              });

              if (attributeError) {
                setImportErrors((state) => [...state, ...[attributeError]]);
              }

              immutableDataList.push({ name: key, type: template[key].type });
              immutableAttributes[key] = template[key].value;
            }
          }

          const immutableData = await handleAttributesData({
            attributes: immutableAttributes,
            dataList: immutableDataList,
          });

          if (immutableData.length > 0) {
            const createTemplate = {
              account: 'atomicassets',
              name: 'createtempl',
              authorization: [
                {
                  actor: ual.activeUser.accountName,
                  permission: ual.activeUser.requestPermission,
                },
              ],
              data: {
                authorized_creator: ual.activeUser.accountName,
                collection_name: collectionName,
                schema_name: fileName,
                transferable: template.transferable,
                burnable: template.burnable,
                max_supply: template.max_supply,
                immutable_data: immutableData,
              },
            };

            newActions.push(createTemplate);
          }
        });

        setActions(newActions);
      }
    }
    handleActions();
  }, [
    schemaAttributes,
    collectionName,
    fileName,
    templates,
    attributes,
    headersLength,
    chainKey,
    ual,
  ]);

  const handleOnChange = (event) => {
    event.preventDefault();

    setRows([]);
    setHints([]);
    setActions([]);
    setUniques({});
    setRequired({});
    setFileName('');
    setDataTypes({});
    setTemplates([]);
    setAttributes([]);
    setImportErrors([]);
    setHeadersLength(0);
    setSchemaAttributes([]);

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    const index = file.name.lastIndexOf('.csv');
    setFileName(file.name.substring(0, index));

    reader.onload = () => {
      try {
        const parsed = Papa.parse(reader.result, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const defaultHeaders = [
          'max_supply',
          'burnable',
          'transferable',
          'sysflag',
        ];

        const fields = parsed.meta.fields;
        const sysflagIndex = fields.indexOf('sysflag');
        const newFields = fields.slice(0, sysflagIndex + 1);

        newFields.forEach((field) => {
          if (!defaultHeaders.includes(field)) {
            setAttributes((state) => [...state, field]);
          }
        });

        const rows = parsed.data
          .filter((row) => {
            const isRowNull = Object.values(row).every(
              (value) => value === null
            );
            return !isRowNull;
          })
          .map((row) => {
            const newRow = {};
            fields.forEach((field) => {
              newRow[field] = row[field];
            });

            if (row['sysflag'] === 'datatype') {
              setDataTypes(row);
              setHeadersLength((prevLength) => prevLength + 1);
            }

            if (row['sysflag'] === 'required') {
              setRequired(row);
              setHeadersLength((prevLength) => prevLength + 1);
            }

            if (row['sysflag'] === 'unique') {
              setUniques(row);
              setHeadersLength((prevLength) => prevLength + 1);
            }

            return newRow;
          });

        setRows(rows);
      } catch (error) {
        console.error(error);
      }
    };

    reader.onerror = (error) => {
      console.error(error);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="container">
        <div className="flex flex-col pb-8 gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="headline-1">{pluginInfo.name}</h1>
            <span className="body-1">{pluginInfo.description}</span>
            <span className="body-1">
              For file specification, see{' '}
              <a
                href="https://github.com/FACINGS/collection-manager/blob/main/docs/plugin-import.md"
                target="_blank"
                rel="noreferrer"
                className="font-bold"
              >
                Import Plugin Documentation
              </a>
              {'.'}
            </span>
          </div>
          {hasRemainingTransactions ? (
            <>
              {transactionBatch?.length > 0 && actions.length === 0 ? (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-row items-center p-8 gap-4 bg-yellow-50 text-neutral-900 rounded-md w-full">
                    <div className="text-yellow-600 p-3.5 rounded-full bg-yellow-400/10">
                      <WarningCircle size={28} />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <span className="title-1">Transaction Batch</span>
                        <span className="body-2">{`It appears that you have a batch of transactions that weren't replicated to the chain. Select continue to review imported data or clear to start a new import.`}</span>
                      </div>
                      <div className="flex flex-row gap-4">
                        <button
                          className="btn btn-solid w-fit bg-neutral-900 text-white border-neutral-900 hover:text-white"
                          onClick={() =>
                            continueImportBatchTransactions({
                              transactionBatch,
                              setActions,
                            })
                          }
                        >
                          Continue
                        </button>
                        <button
                          className="btn btn-outline w-fit hover:text-white"
                          onClick={() =>
                            clearBatch(setHasRemainingTransactions)
                          }
                        >
                          Clear batch
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {actions.length > 0 && (
                    <Review
                      actions={actions}
                      errors={importErrors}
                      schema={existentSchemaInfo['schema']}
                    />
                  )}
                  <button onClick={() => onSubmit()} className="btn w-fit">
                    {pluginInfo.name}
                  </button>
                </>
              )}
            </>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-16"
            >
              <div className="flex gap-4 border-b pb-4 my-4 border-neutral-700 w-fit max-w-sm">
                <label className="flex flex-row items-center">
                  <input
                    {...register('csvFile')}
                    type="file"
                    accept=".csv"
                    onChange={handleOnChange}
                    className="w-full file:hidden"
                  />
                  <div className="btn btn-small">Select&nbsp;File</div>
                </label>
              </div>

              {hints.length > 0 && (
                <div className="flex flex-col gap-4">
                  {hints.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row items-center p-8 gap-4 bg-yellow-50 text-neutral-900 rounded-md w-full"
                      >
                        <div className="text-yellow-600 p-3.5 rounded-full bg-yellow-400/10">
                          <WarningCircle size={28} />
                        </div>
                        <div className="flex flex-col">
                          <>
                            <span className="title-1">{item?.title}</span>
                            <span className="body-2">{item?.message}</span>
                          </>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {actions.length > 25 && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-row items-center p-8 gap-4 bg-yellow-50 text-neutral-900 rounded-md w-full">
                    <div className="text-yellow-600 p-3.5 rounded-full bg-yellow-400/10">
                      <WarningCircle size={28} />
                    </div>
                    <div className="flex flex-col">
                      <>
                        <span className="title-1">Transaction Batch</span>
                        <span className="body-2">{`This process was batched into ${transactions.length} transactions because of the amount of actions, this means that you will have to sign each transaction. You can also change the amount of actions per batch using the batch size selection.`}</span>
                      </>
                    </div>
                  </div>
                  <Select
                    onChange={(option) => setSelectedBatchSizeOption(option)}
                    label="Batch size"
                    selectedValue={batchOptions[0].value}
                    options={batchOptions}
                  />
                </div>
              )}

              {actions.length > 0 && (
                <Review
                  actions={actions}
                  errors={importErrors}
                  schema={existentSchemaInfo['schema']}
                />
              )}

              <button
                className="btn w-fit"
                disabled={!fileName || importErrors.length > 0}
              >
                {pluginInfo.name}
              </button>
            </form>
          )}
        </div>
      </div>
      <Modal ref={modalRef} title={modal.title}>
        <p className="body-2 mt-2">{modal.message}</p>
        {modal.details && (
          <Disclosure>
            <Disclosure.Button className="btn btn-small mt-4">
              Details
            </Disclosure.Button>
            <Disclosure.Panel>
              <pre className="overflow-auto p-4 rounded-lg bg-neutral-700 max-h-96 mt-4">
                <div dangerouslySetInnerHTML={{ __html: modal.details }}></div>
              </pre>
            </Disclosure.Panel>
          </Disclosure>
        )}
      </Modal>
    </>
  );
}

export default withUAL(Import);
