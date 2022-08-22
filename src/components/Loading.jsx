import { LoadingIcon } from '@components/icons/LoadingIcon';

export function Loading() {
    return (
        <div className="container mx-auto my-10 flex w-fit h-fit justify-center rounded-full items-center gap-4 bg-primary p-4">
            <LoadingIcon />
            <p className="text-white font-bold">Loading...</p>
        </div>
    )
}