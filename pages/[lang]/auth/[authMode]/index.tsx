import type { NextPage, GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import Head from "next/head";

import Header from "../../../../components/Header/Header";
import Footer from "../../../../components/Footer/Footer";
import AuthSection from "../../../../components/AuthSection/AuthSection";

import { Languages } from "../../../../models/language";
import { AuthMode } from "../../../../components/AuthForm/AuthForm";
import { authOptions } from "../../../api/auth/[...nextauth]";

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
      <Footer lang={lang} />
    </>
  );
};

// export const getStaticProps: GetStaticProps = async (context) => {
//   const lang = context.params?.lang;
//   const authMode = context.params?.authMode;
//   return {
//     props: {
//       lang: lang,
//       authMode: authMode
//     }
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const langs = [Languages.ua, Languages.en, Languages.ru];
//   const authModes = [AuthMode.login, AuthMode.register, AuthMode.forgotPassword];

//   const paths: {
//     params: {
//       lang: Languages;
//       authMode: AuthMode;
//     };
//   }[] = [];
//   for (const lang of langs) {
//     for (const authMode of authModes) {
//       paths.push({
//         params: { lang, authMode }
//       });
//     }
//   }
//   // console.log("paths: ", paths);
//   return { paths, fallback: false };
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  const lang = context.params?.lang;

  if (session) {
    return {
      redirect: {
        destination: `/${lang}/profile`,
        permanent: false
      }
    };
  }

  const authMode = context.params?.authMode as string;
  if (!(authMode in AuthMode)) {
    return {
      redirect: {
        destination: `/${lang}/auth/login`,
        permanent: false
      }
    };
  }

  return {
    props: { lang, authMode }
  };
};

export default AboutUsPage;
