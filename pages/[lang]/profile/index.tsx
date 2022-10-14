import type { NextPage, GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import Head from "next/head";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Profile from "../../../components/Profile/Profile";

import { Languages } from "../../../models/language";
import { authOptions } from "../../api/auth/[...nextauth]";

interface ProfileProps {
  lang: Languages;
}

const ProfilePage: NextPage<ProfileProps> = ({ lang }) => {
  return (
    <>
      <Head>
        <title>
          {lang === Languages.en
            ? "My profile"
            : lang === Languages.ua
            ? "Мій профіль"
            : "Мой профиль"}
        </title>
        {/* <meta name="description" content="Крипто обмен" /> */}
      </Head>
      <Header lang={lang} />
      <Profile />
      <Footer lang={lang} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  const lang = context.params?.lang;

  if (!session) {
    return {
      redirect: {
        destination: `/${lang}/auth/login`,
        permanent: false
      }
    };
  }

  return {
    props: { lang }
  };
};

export default ProfilePage;
