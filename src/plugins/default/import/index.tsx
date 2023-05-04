import { useState, useRef, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { useRouter } from 'next/router';
import Papa from 'papaparse';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { pluginInfo } from './config';
import { Review } from './review';

import { Modal } from '@components/Modal';

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
  message: string;
}

interface RowsProps {
  [key: string]: any;
}

interface TemplateProps {
  [key: string]: any;
}

function Import({ ual }: ImportProps) {
  const modalRef = useRef(null);
  const router = useRouter();

  const { chainKey, collectionName } = router.query;

  const [fileName, setFileName] = useState<string>('');
  const [rows, setRows] = useState<RowsProps[]>([]);
  const [attributes, setAttributes] = useState<String[]>([]);
  const [actions, setActions] = useState<ActionsProps[]>([]);
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const [importErrors, setImportErrors] = useState<ImportErrorsProps[]>([]);
  const [schemaAttributes, setSchemaAttributes] = useState<
    SchemaAttributesProps[]
  >([]);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(csv),
  });

  async function onSubmit() {
    try {
      if (actions.length > 0) {
        await ual.activeUser.signTransaction(
          { actions },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        );
        modalRef.current?.openModal();
        const title = 'Import was successful';
        const message = 'Please await while we redirect you.';
        setModal({
          title,
          message,
        });
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
    const dataTypes = rows[0];
    const required = rows[1];
    const uniques = rows[2];
    const defaultHeaders = [
      'max_supply',
      'burnable',
      'transferable',
      'sysflag',
    ];
    const attributeTypeOptions = [
      'string',
      'uint64',
      'double',
      'image',
      'ipfs',
      'bool',
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
      .filter((row, index) => {
        const keys = Object.keys(rows[0]);

        if (index > 0 && !keys.every((key) => key in row)) {
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
      .slice(3);

    const headersLength = templateRows.length;

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
            if (duplicates.indexOf(value) !== -1) {
              rowsWithDuplicates.push(index + headersLength + 1);
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

            setImportErrors((state) => [
              ...state,
              ...[
                {
                  index: rowsWithDuplicates[0] - headersLength,
                  title: 'Unique property',
                  message: `Property "${item}" has the value "${
                    duplicates[0]
                  }" repeated at rows "${formatRowsWithDuplicates(
                    rowsWithDuplicates
                  )}" of the CSV.`,
                },
              ],
            ]);
          }
        }
      });
    }

    templateRows.map((template, index) => {
      let newTemplate = {};

      // Checks if a required attribute is empty.
      Object.keys(template).map((item) => {
        if (required[item] && !template[item]) {
          setImportErrors((state) => [
            ...state,
            ...[
              {
                index: index + 1,
                title: 'Required property',
                message: `Missing required attribute "${item}" at row "${
                  index + 1 + headersLength
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
  }, [rows, attributes, reset]);

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

        await templates.map(async (template) => {
          const immutableDataList = [];
          const immutableAttributes = {};

          for (const key in template) {
            if (
              key !== 'burnable' &&
              key !== 'max_supply' &&
              key !== 'transferable'
            ) {
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
  }, [schemaAttributes, collectionName, fileName, templates, attributes, ual]);

  const handleOnChange = (event) => {
    event.preventDefault();

    setRows([]);
    setActions([]);
    setFileName('');
    setTemplates([]);
    setAttributes([]);
    setImportErrors([]);
    setSchemaAttributes([]);

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    setFileName(file.name.split('.')[0]);

    reader.onload = () => {
      try {
        const parsed = Papa.parse(reader.result, {
          header: true,
          dynamicTyping: true,
        });

        const defaultHeaders = [
          'max_supply',
          'burnable',
          'transferable',
          'sysflag',
        ];

        const fields = parsed.meta.fields;
        const sysflag = fields.indexOf('sysflag');
        const newFields = fields.slice(0, sysflag + 1);

        newFields.forEach((field) => {
          if (!defaultHeaders.includes(field)) {
            setAttributes((state) => [...state, field]);
          }
        });

        setRows(parsed.data);
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
          </div>
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
                <div className="btn btn-small">Upload</div>
              </label>
            </div>

            {actions.length > 0 && (
              <Review actions={actions} errors={importErrors} />
            )}

            <button
              className="btn w-fit"
              disabled={!fileName || importErrors.length > 0}
            >
              {pluginInfo.name}
            </button>
          </form>
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
