import { withUAL } from 'ual-reactjs-renderer';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

function Plugin({ plugin }) {
  const DynamicComponent = dynamic(() =>
    import(`../../../../../plugins/${plugin}`).then((mod) => mod)
  );

  return <DynamicComponent />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const plugin = params.plugin as string;

  try {
    return {
      props: {
        plugin,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default withUAL(Plugin);
