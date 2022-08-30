import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import requestIp from "request-ip";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Крипто обмен</title>
        <meta name="description" content="Крипто обмен" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const detectedIp = requestIp.getClientIp(context.req);
  console.log("detectedIp - ", detectedIp);
  // console.log(context.req);
  // console.log(context.req.headers);
  // console.log(context.req.rawHeaders);
  console.log(context.req.headers["accept-language"]);
  // console.log(context.req.headers["x-real-ip"]);
  // console.log(context.req.headers["x-forwarded-for"]);
  // console.log(context.req.);
  const acceptLanguage = context.req.headers["accept-language"];
  // console.log(acceptLanguage);
  let destination;
  if (acceptLanguage && acceptLanguage.startsWith("ua")) {
    destination = "/ua";
  } else if (acceptLanguage && acceptLanguage.startsWith("ru")) {
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
