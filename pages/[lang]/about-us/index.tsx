import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AboutUs from "../../../components/AboutUs/AboutUs";

import { Languages } from "../../../models/language";

interface AboutUsProps {
  lang: Languages;
}

const AboutUsPage: NextPage<AboutUsProps> = ({ lang }) => {
  return (
    <>
      <Head>
        <title>
          {lang === Languages.en ? "About us" : lang === Languages.ua ? "Про нас" : "О нас"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <Header lang={lang} />
      <AboutUs />
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

export default AboutUsPage;
