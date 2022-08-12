import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useMemo } from "react";

import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";

const textData = (lang: "ua" | "en" | "ru") => {
  if (lang === "ua") {
    return {
      heading: "Купити криптовалюту в Україні",
      paragraph:
        "Найзручніший спосіб продати криптовалюту в Україні онлайн. Зарахування на будь-яку банківську карту. Надійно, швидко, в автоматичному режимі. Без прихованих комісій."
    };
  }
  if (lang === "en") {
    return {
      heading: "Buy cryptocurrency in Ukraine",
      paragraph:
        "The most convenient way to sell cryptocurrency in Ukraine online. Enrollment on any bank card. Reliably, quickly, in automatic mode. Without hidden commissions."
    };
  } else {
    return {
      heading: "Купить криптовалюту в Украине",
      paragraph:
        "Наиболее удобный способ продать криптовалюту в Украине онлайн. Зачисление на любую банковскую карту. Надежно, быстро, в автоматическом режиме. Без скрытых комиссий."
    };
  }
};

interface HomeProps {
  lang: "ua" | "en" | "ru";
}

const Home: NextPage<HomeProps> = ({ lang }) => {
  const heroTextData = useMemo(() => {
    return textData(lang);
  }, [lang]);

  return (
    <>
      <Header lang={lang} />
      <Hero text={heroTextData} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
  const lang = context.params?.lang;
  return {
    props: {
      lang: lang
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const langs: string[] = ["ua", "en", "ru"];
  const paths = langs.map((lang) => {
    return {
      params: { lang }
    };
  });
  return { paths, fallback: false };
};

export default Home;
