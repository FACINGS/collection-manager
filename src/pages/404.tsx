import Head from 'next/head';
import { FlyingSaucer } from 'phosphor-react';

export default function PageNotFound() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>Page Not Found</title>
      </Head>

      <div className="grid justify-items-center content-center h-[calc(100vh-15rem)]">
        <div className="col-start-1 col-end-2 row-start-1 row-end-2">
          <h1 className="font-bold text-7xl uppercase text-center text-neutral-800">
            Page Not Found
          </h1>
        </div>
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 text-center">
          <FlyingSaucer size={128} className="-mt-[4.5rem]" />
          <span className="headline-2 block font-bold skew-y-12 tracking-widest">
            404
          </span>
        </div>
      </div>
    </>
  );
}
