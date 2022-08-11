import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

import Header from "../../components/Header/Header";

import { useAppDispatch } from "../../utils/ts/hooks";
import { closeMobileMenu, toggleMobileMenu } from "../../store/reducers/mobileMenuSlice";

interface HomeProps {
  lang: "ua" | "en" | "ru";
}

const Home: NextPage<HomeProps> = ({ lang }) => {
  // const menuMobileState = useAppSelector(state => state.mobileMenuState.isOpen)
  const dispatch = useAppDispatch();

  const router = useRouter();

  const closeMenu = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const changeLanguage = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const languageName = e.currentTarget.getAttribute("data-name");
    router.push({
      pathname: router.pathname,
      query: { lang: languageName }
    });
  }, []);

  return (
    <>
      <Header lang={lang} />
      <div>hello - {lang}</div>
      <div>
        <button onClick={closeMenu}>close menu</button>
        <button onClick={toggleMenu}>toggle menu</button>
      </div>
      <div>
        <button data-name={"ua"} onClick={changeLanguage}>
          UA
        </button>
        <button data-name={"en"} onClick={changeLanguage}>
          EN
        </button>
        <button data-name={"ru"} onClick={changeLanguage}>
          RU
        </button>
      </div>
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
