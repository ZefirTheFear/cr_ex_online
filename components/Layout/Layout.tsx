import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppDispatch } from "../../utils/ts/hooks";
import { setLang } from "../../store/reducers/langSlice";
import { languages } from "../../data/languageItems";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    const languageName = router.query.lang;
    console.log(languageName);
    const newSelectedLanguage = languages.find((lang) => lang.name === languageName);
    if (newSelectedLanguage) {
      dispatch(setLang(newSelectedLanguage));
    }
  }, [dispatch, router.query.lang]);

  return <>{props.children}</>;
};

export default Layout;
