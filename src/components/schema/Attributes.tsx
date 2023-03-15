import { TrashSimple, HandGrabbing } from 'phosphor-react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Input } from '@components/Input';
import { Select } from '@components/Select';

yup.addMethod(yup.array, 'unique', function (field, message) {
  return this.test('unique', message, function (array) {
    const uniqueData = Array.from(
      new Set(array.map((row) => row[field]?.toLowerCase()))
    );

    const isUnique = array.length === uniqueData.length;
    if (isUnique) {
      return true;
    }

    const index = array.findIndex(
      (row, i) => row[field]?.toLowerCase() !== uniqueData[i]
    );

    if (array[index][field] === '') {
      return true;
    }

    return this.createError({
      path: `${this.path}.${index}.${field}`,
      message,
    });
  });
});

const attributeOptions = [
  { label: 'Text', value: 'string' },
  { label: 'Integer Number', value: 'uint64' },
  { label: 'Floating Point Number', value: 'double' },
  { label: 'Image', value: 'image' },
  { label: 'IPFS Hash', value: 'ipfs' },
  { label: 'Boolean', value: 'bool' },
  /*
  // For reference -- all other available types.
  { label: 'int8', value: 'int8' },
  { label: 'int16', value: 'int16' },
  { label: 'int32', value: 'int32' },
  { label: 'int64', value: 'int64' },
  { label: 'uint8', value: 'uint8' },
  { label: 'uint16', value: 'uint16' },
  { label: 'uint32', value: 'uint32' },
  { label: 'fixed8', value: 'fixed8' },
  { label: 'fixed16', value: 'fixed16' },
  { label: 'fixed32', value: 'fixed32' },
  { label: 'fixed64', value: 'fixed64' },
  { label: 'float', value: 'float' },
  { label: 'int8[]', value: 'int8[]' },
  { label: 'int16[]', value: 'int16[]' },
  { label: 'int32[]', value: 'int32[]' },
  { label: 'int64[]', value: 'int64[]' },
  { label: 'uint8[]', value: 'uint8[]' },
  { label: 'uint16[]', value: 'uint16[]' },
  { label: 'uint32[]', value: 'uint32[]' },
  { label: 'uint64[]', value: 'uint64[]' },
  { label: 'fixed8[]', value: 'fixed8[]' },
  { label: 'fixed16[]', value: 'fixed16[]' },
  { label: 'fixed32[]', value: 'fixed32[]' },
  { label: 'fixed64[]', value: 'fixed64[]' },
  { label: 'float[]', value: 'float[]' },
  { label: 'double[]', value: 'double[]' },
  { label: 'string[]', value: 'string[]' },
  { label: 'image[]', value: 'image[]' },
  */
];

interface AttributeProps {
  attributes: {
    name: string;
    type: string;
  }[];
}

export function Attributes({ attributes }: AttributeProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const {
    move,
    fields: attributesFields,
    append: attributesAppend,
    prepend: attributesPrepend,
    remove: attributesRemove,
  } = useFieldArray({
    control,
    name: 'attributes',
  });

  const attributesWatched = watch('attributes');

  const attributesToValid = [...attributes, ...attributesWatched];

  const hasImageAttribute = attributesToValid.some(
    (attribute) => attribute.name === 'img' && attribute.type === 'image'
  );

  const hasVideoAttribute = attributesToValid.some(
    (attribute) => attribute.name === 'video' && attribute.type === 'string'
  );

  function handleAppendAttribute() {
    attributesAppend({
      name: '',
      type: attributeOptions[0].value,
    });
  }

  function handlePrependAttribute(name: string, type: string) {
    attributesPrepend({
      name,
      type,
    });
  }

  function handleRemoveAttribute(index: number) {
    attributesRemove(index);
  }

  const handleDrag = ({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="body-2 text-white">
        <div className="flex gap-4 mb-4 font-bold">
          <span className="flex-1">Attribute</span>
          <span className="flex-1">Type</span>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded">
          {attributes.map((attribute) => (
            <div
              key={attribute.name}
              className="flex gap-4 p-4 border-b border-neutral-700 last:border-b-0"
            >
              <span className="flex-1">{attribute.name}</span>
              <span className="flex-1">
                {attribute.type === 'string' ? 'text' : attribute.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="attributes">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {attributesFields.map((field, index) => {
                return (
                  <Draggable
                    key={index}
                    draggableId={`field-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        key={field.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="flex w-full flex-col sm:flex-row gap-4 sm:border-0 border-b border-neutral-700 pb-4">
                          <div className="flex-1">
                            <Input
                              {...register(`attributes.${index}.name`)}
                              error={errors.attributes?.[index]?.name?.message}
                              placeholder="Attribute name"
                              type="text"
                            />
                          </div>
                          <div className="flex-1 flex gap-4">
                            <div className="flex-1">
                              <Controller
                                control={control}
                                name={`attributes.${index}.type`}
                                render={({ field }) => (
                                  <Select
                                    onChange={field.onChange}
                                    selectedValue={field.value}
                                    options={attributeOptions}
                                  />
                                )}
                              />
                            </div>
                            <div className="flex-none">
                              <button
                                type="button"
                                className="btn btn-square"
                                onClick={() => handleRemoveAttribute(index)}
                              >
                                <TrashSimple size={24} />
                              </button>
                            </div>
                          </div>
                          <div
                            {...provided.dragHandleProps}
                            className="btn btn-ghost btn-square"
                          >
                            <HandGrabbing size={24} />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex gap-4">
        <button type="button" className="btn" onClick={handleAppendAttribute}>
          Add attribute
        </button>
        {!hasImageAttribute && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handlePrependAttribute('img', 'image')}
          >
            Add img
          </button>
        )}
        {!hasVideoAttribute && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handlePrependAttribute('video', 'string')}
          >
            Add video
          </button>
        )}
      </div>
    </div>
  );
}
