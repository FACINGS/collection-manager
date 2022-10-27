import { useState, forwardRef } from 'react';
import Image from 'next/image';
import {
  UploadSimple,
  File,
  FileCsv,
  FilePdf,
  PencilSimple,
  Plus,
} from 'phosphor-react';

function InputFilePreviewComponent(
  { onChange, title, description, ...props },
  ref
) {
  const [previewSrc, setPreviewSrc] = useState(null);

  function handleOnChange(event) {
    onChange(event);
    setPreviewSrc(null);

    const files = event.target.files;

    if (files.length > 0) {
      const [file] = files;
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setPreviewSrc(fileReader.result);
      };

      fileReader.readAsDataURL(file);
    }
  }

  return (
    <label className="block aspect-video bg-neutral-800 rounded cursor-pointer p-4 border border-neutral-700">
      {/image/.test(previewSrc) ? (
        <div className="relative w-full h-full">
          <Image
            src={previewSrc}
            objectFit="contain"
            className="rounded-md"
            layout="fill"
            alt=""
          />
        </div>
      ) : /video\/mp4/.test(previewSrc) ? (
        <video
          muted
          autoPlay
          loop
          playsInline
          className="w-full h-full object-contain"
        >
          <source src={previewSrc} type="video/mp4" />
        </video>
      ) : /text\/csv/.test(previewSrc) ? (
        <div className="w-full h-full flex justify-center items-center">
          <FileCsv size={56} />
        </div>
      ) : /application\/pdf/.test(previewSrc) ? (
        <div className="w-full h-full flex justify-center items-center">
          <FilePdf size={56} />
        </div>
      ) : previewSrc ? (
        <div className="w-full h-full flex justify-center items-center">
          <File size={56} />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-center">
          <UploadSimple size={56} />
          {title && <p className="title-1">{title}</p>}
          {description && <p className="body-3">{description}</p>}
        </div>
      )}
      <div className="flex gap-2 items-center border-t border-neutral-700 pt-2">
        <div className="flex-1">
          <input
            {...props}
            ref={ref}
            onChange={handleOnChange}
            type="file"
            className="w-full body-1 text-white focus:outline-none file:hidden"
          />
        </div>
        <div className="flex-none">
          <div className="btn btn-small btn-ghost btn-square">
            {previewSrc ? <PencilSimple size={24} /> : <Plus size={24} />}
          </div>
        </div>
      </div>
    </label>
  );
}

export const InputFilePreview = forwardRef(InputFilePreviewComponent);
