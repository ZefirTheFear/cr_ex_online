import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { useMemo } from "react";

import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";

import { Languages } from "../../models/language";

const textData = (lang: Languages) => {
  if (lang === Languages.ua) {
    return {
      heading: "Продати криптовалюту онлайн",
      paragraph:
        "Найзручніший спосіб продати криптовалюту в Україні онлайн. Зарахування на будь-яку банківську карту. Надійно, швидко, в автоматичному режимі. Без прихованих комісій."
    };
  }
  if (lang === Languages.en) {
    return {
      heading: "Sell cryptocurrency online",
      paragraph:
        "The most convenient way to sell cryptocurrency in Ukraine online. Enrollment on any bank card. Reliably, quickly, in automatic mode. Without hidden commissions."
    };
  } else {
    return {
      heading: "Продать криптовалюту онлайн",
      paragraph:
        "Наиболее удобный способ продать криптовалюту в Украине онлайн. Зачисление на любую банковскую карту. Надежно, быстро, в автоматическом режиме. Без скрытых комиссий."
    };
  }
};

interface HomePageProps {
  lang: Languages;
}

const HomePage: NextPage<HomePageProps> = ({ lang }) => {
  const heroTextData = useMemo(() => {
    return textData(lang);
  }, [lang]);

  return (
    <>
      <Head>
        <title>
          {lang === Languages.en
            ? "Crypto exchange"
            : lang === Languages.ua
            ? "Крипто обмін"
            : "Крипто обмен"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <Header lang={lang} />
      <Hero text={heroTextData} />
      <Footer lang={lang} />
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

export default HomePage;
