import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
// import { unstable_getServerSession } from "next-auth/next";

import Header from "../../../../components/Header/Header";
import Footer from "../../../../components/Footer/Footer";
import ExchangeForm from "../../../../components/ExchangeForm/ExchangeForm";
// import { authOptions } from "../../../api/auth/[...nextauth]";

import { Languages } from "../../../../models/language";

interface NewOrderProps {
  lang: Languages;
  orderId: string;
}

const NewOrderPage: NextPage<NewOrderProps> = ({ lang, orderId }) => {
  return (
    <>
      <Head>
        <title>
          {lang === Languages.en
            ? "New Order"
            : lang === Languages.ua
            ? "Нова заявка"
            : "Новая заявка"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <Header lang={lang} />
      <ExchangeForm orderId={orderId} />
      <Footer lang={lang} />
    </>
  );
};

interface Params extends ParsedUrlQuery {
  lang: string;
  orderId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // const isSession = session ? true : false;

  const params = context.params as Params;

  const lang = params.lang;
  const orderId = params.orderId;

  // const orderId = orderData.slice(3);
  // const operationType = orderData.slice(0, 3);

  return {
    props: {
      lang,
      orderId
      // isSession
    }
  };
};

export default NewOrderPage;
