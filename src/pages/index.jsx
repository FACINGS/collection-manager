import Head from 'next/head';
import { chainKeyDefault } from '@configs/globalsConfig';

export default function Home() {
  return (
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
  );
}

export async function getServerSideProps() {
  const destination = chainKeyDefault;

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
}
