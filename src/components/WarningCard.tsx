import { WarningCircle } from '@phosphor-icons/react';

interface WarningCardProps {
  title: string;
  content: string;
  callback?: () => void;
  clear?: () => void;
}

export function WarningCard({
  title,
  content,
  callback,
  clear,
}: WarningCardProps) {
  return (
    <div className="flex sm:flex-row flex-col items-center p-8 gap-8 bg-yellow-50 text-neutral-900 rounded-md w-full">
      <div className="text-yellow-600 p-3.5 rounded-full bg-yellow-400/10">
        <WarningCircle size={28} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="title-1">{title}</span>
          <span className="body-2">{content}</span>
        </div>
        {callback && clear && (
          <div className="flex sm:flex-row flex-col gap-4">
            <button
              type="button"
              className="btn btn-solid sm:w-fit w-full bg-neutral-900 text-white border-neutral-900 hover:text-white"
              onClick={callback}
            >
              Continue
            </button>
            <button
              type="button"
              className="btn btn-outline sm:w-fit w-full hover:text-white"
              onClick={clear}
            >
              Clear batch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
