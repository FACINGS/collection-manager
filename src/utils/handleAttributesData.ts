import { uploadImageToIpfsService } from '@services/collection/uploadImageToIpfsService';

interface DataProps {
  key: string;
  value: any[];
}

interface handleAttributesDataProps {
  attributes: {
    [key: string]: any;
  };
  dataList: {
    name: string;
    type: string;
    isImmutable?: boolean;
  }[];
}

export async function handleAttributesData({
  attributes,
  dataList,
}: handleAttributesDataProps) {
  const filesAttributes = Object.keys(attributes).reduce(
    (accumulatorAttributes, keyAttribute) => {
      const attributeValue = attributes[`${keyAttribute}`];
      const shouldMakeUpload =
        attributeValue &&
        typeof attributeValue === 'object' &&
        attributeValue.length > 0;

      if (shouldMakeUpload) {
        return [
          ...accumulatorAttributes,
          {
            name: keyAttribute,
            value: attributeValue[0],
          },
        ];
      }
      return accumulatorAttributes;
    },
    []
  );

  const pinataFiles = await Promise.all(
    filesAttributes.map((fileAttribute) =>
      uploadImageToIpfsService(fileAttribute.value)
    )
  );

  filesAttributes.forEach((fileAttribute, fileAttributeIndex) => {
    attributes[fileAttribute.name] =
      pinataFiles[fileAttributeIndex]['IpfsHash'];
  });

  const data: DataProps[] = [];

  dataList.map(({ name, type, isImmutable }) => {
    const attributeValue = attributes[`${name}`];

    if (isImmutable !== undefined && !isImmutable) {
      return;
    }

    if (type === 'image' || type === 'ipfs' || type === 'video') {
      data.push({
        key: name,
        value: ['string', attributeValue],
      });
    } else if (type === 'bool') {
      data.push({
        key: name,
        value: ['uint8', attributeValue ? 1 : 0],
      });
    } else if (type === 'double') {
      data.push({
        key: name,
        value: ['float64', parseInt(attributeValue)],
      });
    } else if (type === 'uint64') {
      data.push({
        key: name,
        value: [type, parseInt(attributeValue)],
      });
    } else if (type === 'string') {
      data.push({
        key: name,
        value: [type, attributeValue],
      });
    }
  });

  return data;
}
