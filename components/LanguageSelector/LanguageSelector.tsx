import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { FaAngleDown } from "react-icons/fa";

import DropdownList from "../DropdownList/DropdownList";

import { languages } from "../../data/languageItems";

import classes from "./LanguageSelector.module.scss";

const LgSelector: React.FC = () => {
  const router = useRouter();

  const [isOpenedLangOptions, setIsOpenedLangOptions] = useState(false);

  const currentLang = router.query.lang;
  const languagesOpts = languages.map((lang) => lang.name).filter((lang) => lang !== currentLang);

  const changeLanguage = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const languageName = e.currentTarget.getAttribute("data-name");
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, lang: languageName }
      });
    },
    [router]
  );

  return (
    <div className={classes["language-selector"]}>
      <DropdownList
        toggler={
          <>
            <div className={classes["language-selector__selected"]}>
              <span className={classes["language-selector__selected-name"]}>{currentLang}</span>
              <span
                className={
                  `${classes["language-selector__select-arrow"]}` +
                  (isOpenedLangOptions
                    ? ` ${classes["language-selector__select-arrow_is-opened"]}`
                    : ``)
                }
              >
                <FaAngleDown />
              </span>
            </div>
          </>
        }
        options={
          <>
            <ul className={classes["language-selector__options"]}>
              {languagesOpts.map((lang) => {
                return (
                  <li
                    className={classes["language-selector__options-item"]}
                    data-name={lang}
                    onClick={changeLanguage}
                    key={lang}
                  >
                    {lang}
                  </li>
                );
              })}
            </ul>
          </>
        }
        isOpenOptions={isOpenedLangOptions}
        setIsOpenOptions={setIsOpenedLangOptions}
      />
    </div>
  );
};

export default LgSelector;
