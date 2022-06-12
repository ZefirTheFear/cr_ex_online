import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useAppDispatch } from "../../utils/ts/hooks";
import { closeMobileMenu, toggleMobileMenu } from "../../store/reducers/mobileMenuSlice";
import { setLang } from "../../store/reducers/langSlice";
import { languages } from "../../data/languageItems";

const Home: NextPage = () => {
  const router = useRouter();

  const text = router.query;
  // console.log(text);

  // const menuMobileState = useAppSelector(state => state.mobileMenuState.isOpen)
  const dispatch = useAppDispatch();

  const closeMenu = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const setLanguage = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const languageName = e.currentTarget.getAttribute("data-name");
      const newSelectedLanguage = languages.find((lang) => lang.name === languageName);
      if (newSelectedLanguage) {
        dispatch(setLang(newSelectedLanguage));
      }
    },
    [dispatch]
  );

  return (
    <>
      <div>hello - {text.lang}</div>
      <div>
        <button onClick={closeMenu}>close menu</button>
        <button onClick={toggleMenu}>toggle menu</button>
      </div>
      <div>
        <button data-name={"ua"} onClick={setLanguage}>
          UA
        </button>
        <button data-name={"en"} onClick={setLanguage}>
          EN
        </button>
        <button data-name={"ru"} onClick={setLanguage}>
          RU
        </button>
      </div>
    </>
  );
};

export default Home;
