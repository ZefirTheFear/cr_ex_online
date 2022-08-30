import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";

import Header from "../../../components/Header/Header";
import AuthSection from "../../../components/AuthSection/AuthSection";
import Footer from "../../../components/Footer/Footer";

import { Languages } from "../../../models/language";

interface HomePageProps {
  lang: Languages;
}

const AuthPage: NextPage<HomePageProps> = ({ lang }) => {
  return (
    <>
      <Head>
        <title>
          {lang === Languages.en
            ? "Authentication"
            : lang === Languages.ua
            ? "Аутентифікація"
            : "Аутентификация"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <Header lang={lang} />
      <AuthSection />
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

export default AuthPage;
