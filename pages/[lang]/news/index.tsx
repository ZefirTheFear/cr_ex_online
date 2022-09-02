import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

import { Languages } from "../../../models/language";

interface NewsProps {
  lang: Languages;
}

const NewsPage: NextPage<NewsProps> = ({ lang }) => {
  return (
    <>
      <Head>
        <title>
          {lang === Languages.en ? "News" : lang === Languages.ua ? "Новини" : "Новости"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <div>News</div>
      <Header lang={lang} />
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const lang = context.params?.lang;
  return {
    props: {
      lang: lang
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const langs: Languages[] = [Languages.ua, Languages.en, Languages.ru];
  const paths = langs.map((lang) => {
    return {
      params: { lang }
    };
  });
  return { paths, fallback: false };
};

export default NewsPage;
