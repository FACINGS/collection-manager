import { useRouter } from 'next/router';
import Link from 'next/link';

import { chainKeyDefault } from '@configs/globalsConfig';

export function NotAllowed() {
  const router = useRouter();
  const chainKey = router.query.chainKey ?? chainKeyDefault;

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 justify-center items-center bg-zinc-800 rounded-xl h-[calc(100vh-14rem)]">
        <span className="headline-3">You don't have authorization.</span>
        <Link href={`/${chainKey}`} className="btn">
          My Collections
        </Link>
      </div>
    </div>
  );
}
