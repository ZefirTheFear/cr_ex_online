import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Крипто обмен</title>
        <meta name="description" content="Крипто обмен" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: "/ua",
      permanent: false
    }
  };
};

export default Home;
