import type { NextPage, GetStaticProps, GetStaticPaths } from "next";

import Header from "../../components/Header/Header";

interface HomeProps {
  lang: "ua" | "en" | "ru";
}

const Home: NextPage<HomeProps> = ({ lang }) => {
  return (
    <>
      <Header lang={lang} />
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
