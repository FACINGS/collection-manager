import { CircleNotch } from '@phosphor-icons/react';

interface SeeMoreButtonProps {
  isLoading: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function SeeMoreButton({ isLoading, onClick }: SeeMoreButtonProps) {
  return isLoading ? (
    <span className="flex gap-2 items-center p-4 body-2 font-bold text-white">
      <CircleNotch size={24} weight="bold" className="animate-spin" />
      Loading...
    </span>
  ) : (
    <button type="button" className="btn" onClick={onClick}>
      See more
    </button>
  );
}
