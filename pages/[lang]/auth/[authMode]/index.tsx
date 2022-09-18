import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";

import Header from "../../../../components/Header/Header";
import Footer from "../../../../components/Footer/Footer";
import AuthSection from "../../../../components/AuthSection/AuthSection";

import { Languages } from "../../../../models/language";
import { AuthMode } from "../../../../components/AuthForm/AuthForm";

interface AuthPageProps {
  lang: Languages;
  authMode: AuthMode;
}

const AboutUsPage: NextPage<AuthPageProps> = ({ lang, authMode }) => {
  return (
    <>
      <Head>
        <title>
          {authMode === AuthMode.login
            ? lang === Languages.en
              ? "Login"
              : lang === Languages.ua
              ? "Вхід"
              : "Вход"
            : authMode === AuthMode.register
            ? lang === Languages.en
              ? "Registration"
              : lang === Languages.ua
              ? "Реєстрація"
              : "Регистрация"
            : lang === Languages.en
            ? "Getting New Password"
            : lang === Languages.ua
            ? "Отримання нового паролю"
            : "Получение нового пароля"}
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
  const authMode = context.params?.authMode;
  return {
    props: {
      lang: lang,
      authMode: authMode
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const langs = [Languages.ua, Languages.en, Languages.ru];
  const authModes = [AuthMode.login, AuthMode.register, AuthMode.forgotPassword];

  const paths: {
    params: {
      lang: Languages;
      authMode: AuthMode;
    };
  }[] = [];
  for (const lang of langs) {
    for (const authMode of authModes) {
      paths.push({
        params: { lang, authMode }
      });
    }
  }
  // console.log("paths: ", paths);
  return { paths, fallback: false };
};

export default AboutUsPage;
