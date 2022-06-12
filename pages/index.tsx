import type { GetServerSideProps, NextPage } from "next";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log(context.req.rawHeaders);
  const index = context.req.rawHeaders.indexOf("Accept-Language");
  const acceptLanguage = context.req.rawHeaders[index + 1];
  // console.log(acceptLanguage);
  let destination;
  if (acceptLanguage.startsWith("ua")) {
    destination = "/ua";
  } else if (acceptLanguage.startsWith("ru")) {
    destination = "/ru";
  } else {
    destination = "/en";
  }

  return {
    redirect: {
      destination: destination,
      permanent: false
    }
  };
};

export default Home;
