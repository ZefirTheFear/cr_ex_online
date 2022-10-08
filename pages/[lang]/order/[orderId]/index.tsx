import type { NextPage } from "next";
import Head from "next/head";

import Header from "../../../../components/Header/Header";
import Footer from "../../../../components/Footer/Footer";
import ExchangeForm from "../../../../components/ExchangeForm/ExchangeForm";

import { Languages } from "../../../../models/language";

interface NewOrderProps {
  lang: Languages;
}

const NewOrderPage: NextPage<NewOrderProps> = ({ lang }) => {
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
      <ExchangeForm />
      <Footer />
    </>
  );
};

export default NewOrderPage;
