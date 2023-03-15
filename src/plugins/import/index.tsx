import { useState, useRef, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { withUAL } from 'ual-reactjs-renderer';
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { name, subtitle } from './config';

import { Modal } from '@components/Modal';

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

function Import({ ual }: ImportProps) {
  const modalRef = useRef(null);
  const router = useRouter();

  const { chainKey, collectionName } = router.query;

  const [fileName, setFileName] = useState<string>('');
  const [actions, setActions] = useState([]);
  const [schemaAttributes, setSchemaAttributes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [invalidType, setInvalidType] = useState([]);
  const [requiredProperties, setRequiredProperties] = useState([]);
  const [uniqueProperties, setUniqueProperties] = useState([]);
  const [invalidUniqueProperties, setInvalidUniqueProperties] = useState([]);
  const [modal, setModal] = useState<ModalProps>({
    title: '',
    message: '',
    details: '',
  });

  const attributeTypeOptions = [
    'string',
    'uint64',
    'double',
    'image',
    'ipfs',
    'bool',
  ];

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(csv),
  });

  useEffect(() => {
    setActions([]);
    setTemplates([]);
    setSchemaAttributes([]);
  }, [fileName]);

  useEffect(() => {
    function resetAllValues() {
      reset();
      setActions([]);
      setFileName('');
      setTemplates([]);
      setInvalidType([]);
      setUniqueProperties([]);
      setSchemaAttributes([]);
      setRequiredProperties([]);
      setInvalidUniqueProperties([]);
    }

    if (
      fileName &&
      !fileName.match(/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/)
    ) {
      modalRef.current?.openModal();
      const title = 'Invalid File Name';
      const message =
        'The file name is used to define the name of the schema and it must be up to 12 characters (a-z, 1-5, .) and cannot end with a "."';

      setModal({
        title,
        message,
      });

      resetAllValues();
    }

    if (invalidType.length > 0) {
      modalRef.current?.openModal();
      const title = 'Invalid Type';
      const message =
        'A schema property has an invalid type please check the valid datatypes list.';
      const details = `${invalidType
        .map((item) => {
          const { property, type } = item;
          return `<p>Property: <b>"${property}"</b> has an invalid datatype <b>"${type}"</b>.</p><br>`;
        })
        .toString()
        .replace(/,/, '')}`;

      setModal({
        title,
        message,
        details,
      });

      resetAllValues();
    }

    if (requiredProperties.length > 0) {
      modalRef.current?.openModal();
      const title = 'Required Attribute';
      const message =
        'A required attribute is empty please check the details for more information.';
      const details = `${requiredProperties
        .map((item) => {
          return `<p>Property <b>"${item.property}"</b> is empty at row <b>"${
            item.templateIndex + 6
          }".</p></br>`;
        })
        .toString()
        .replace(/,/g, '')}`;

      setModal({
        title,
        message,
        details,
      });

      resetAllValues();
    }

    if (invalidUniqueProperties.length > 0) {
      modalRef.current?.openModal();
      const title = 'Unique Attribute';
      const message =
        'An attribute that should be unique has been repeated, please check the details for more information.';
      const details = `${invalidUniqueProperties
        .map((item) => {
          return `<p>Property <b>"${item.property}"</b> has the value <b>"${
            item.repeated
          }"</b> repeated at rows ${item.rows.map(
            (row) => `<b>"${row}";</b>`
          )}.</p></br>`;
        })
        .toString()
        .replace(/,/g, '')}`;

      setModal({
        title,
        message,
        details,
      });

      resetAllValues();
    }
  }, [
    invalidType,
    requiredProperties,
    invalidUniqueProperties,
    fileName,
    reset,
  ]);

  useEffect(() => {
    if (uniqueProperties.length > 0) {
      uniqueProperties.map((item) => {
        const rows = [];
        const repeatedProperty = item.data.filter(
          (currentValue, currentIndex) =>
            item.data.indexOf(currentValue) !== currentIndex
        )[0];

        if (repeatedProperty) {
          item.data.map((item, index) => {
            item === repeatedProperty && rows.push(index);
          });

          setInvalidUniqueProperties((state) => [
            ...state,
            ...[
              {
                property: item.property,
                repeated: repeatedProperty,
                rows: rows,
              },
            ],
          ]);
        }
      });
    }
  }, [uniqueProperties]);

  const handleCSVFile = (string) => {
    const filteredHeaders = string
      .slice(0, string.indexOf('\n'))
      .replace(/(\r)/g, '')
      .split(',')
      .filter((header) => header !== '');

    const sysflagIndex = filteredHeaders.indexOf('sysflag');

    const rows = string
      .slice(string.indexOf('\n') + 1)
      .replace(/(\r)/g, '')
      .split('\n')
      .slice(0, sysflagIndex);

    let headersInfo = [];
    const templatesInfo = [];

    const headers = filteredHeaders.slice(0, sysflagIndex + 1);

    const sysflags = ['datatype', 'unique', 'required', 'mutable'];

    rows.map((item) => {
      const rowItem = item.split(',');

      const isHeader =
        rowItem.filter((item) => sysflags.includes(item)).length > 0;

      if (isHeader) {
        const header = rowItem
          .filter((item) => item !== '')
          .slice(0, headers.length - 3);

        const sysflag = header.pop();

        headersInfo = {
          ...headersInfo,
          ...{ [sysflag]: header },
        };
      } else {
        templatesInfo.push(rowItem.slice(0, headers.length - 1));
      }
    });

    const excludeHeaders = [
      'sysflag',
      'max_supply',
      'burnable',
      'transferable',
    ];

    if (!headers.includes('img' || 'video')) {
      modalRef.current?.openModal();
      const title = 'Add img or video attribute';
      const message =
        'Your schema must contain at least one img or video attribute.';

      setModal({
        title,
        message,
      });

      reset();
      return;
    }

    templatesInfo.map((property, key) => {
      property.map((item, index) => {
        const required =
          headersInfo['required'][index] === 'TRUE' ? true : false;

        if (required && item === '') {
          setRequiredProperties((state) => [
            ...state,
            ...[{ property: headers[index], templateIndex: key }],
          ]);
        }
      });
    });

    headersInfo['unique'].map((element, index) => {
      const isUnique = element === 'TRUE' ? true : false;
      const values = [];

      templatesInfo.map((item) => {
        values.push(item[index]);
      });

      if (isUnique) {
        setUniqueProperties((state) => [
          ...state,
          ...[
            {
              property: headers[index],
              data: values,
            },
          ],
        ]);
      }
    });

    headersInfo['datatype'].map((type, index) => {
      if (!attributeTypeOptions.includes(type)) {
        const invalid = { property: headers[index], type: type };
        setInvalidType((state) => [...state, ...[invalid]]);
      }
    });

    const attributes = [];
    headers
      .filter((attribute) => !excludeHeaders.includes(attribute))
      .map((attribute, index) => {
        attributes.push({
          name: attribute,
          type: headersInfo['datatype'] && headersInfo['datatype'][index],
        });
      });

    setSchemaAttributes(attributes);

    templatesInfo.map((template) => {
      let newTemplate = {};
      headers
        .filter((header) => header !== 'sysflag')
        .map((item, index) => {
          if (!excludeHeaders.includes(item)) {
            const { type } = attributes.find(
              (element) => element.name === item
            );

            newTemplate = {
              ...newTemplate,
              ...{
                [item]: {
                  value: template[index],
                  type: type,
                  mutable:
                    headersInfo['mutable'] &&
                    headersInfo['mutable'][index] === 'TRUE'
                      ? true
                      : false,
                },
              },
            };
          } else {
            newTemplate = { ...newTemplate, ...{ [item]: template[index] } };
          }
        });

      setTemplates((state) => [...state, ...[newTemplate]]);
    });
  };

  useEffect(() => {
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

      templates.map((template) => {
        const immutableData = [];

        for (const key in template) {
          if (
            key !== 'burnable' &&
            key !== 'max_supply' &&
            key !== 'transferable' &&
            !template[key].mutable
          ) {
            if (
              template[key].type === 'image' ||
              template[key].type === 'ipfs' ||
              template[key].name === 'video'
            ) {
              immutableData.push({
                key: key,
                value: ['string', template[key].value],
              });
            } else if (template[key].type === 'bool') {
              immutableData.push({
                key: key,
                value: ['uint8', parseInt(template[key].value)],
              });
            } else if (template[key].type === 'double') {
              immutableData.push({
                key: key,
                value: ['float64', parseInt(template[key].value)],
              });
            } else if (template[key].type === 'uint64') {
              immutableData.push({
                key: key,
                value: ['uint64', parseInt(template[key].value)],
              });
            } else {
              immutableData.push({
                key: key,
                value: [template[key].type, template[key].value],
              });
            }
          }
        }

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
            transferable: template.transferable === 'TRUE' ? true : false,
            burnable: template.burnable === 'TRUE' ? true : false,
            max_supply: template.max_supply,
            immutable_data: immutableData,
          },
        };

        newActions.push(createTemplate);
      });

      setActions(newActions);
    }
  }, [ual, collectionName, fileName, schemaAttributes, templates]);

  async function onSubmit() {
    if (invalidType.length > 0) {
      return;
    }

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

  const handleOnChange = (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      setFileName(file.name.split('.')[0]);

      fileReader.onload = () => {
        handleCSVFile(fileReader.result);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <>
      <div className="container">
        <div className="flex flex-col py-16 gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="headline-1">{name}</h1>
            <span className="body-1">{subtitle}</span>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex gap-4 border-b pb-4 border-neutral-700 w-fit">
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
            <button className="btn w-fit" disabled={!fileName}>
              {name}
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
