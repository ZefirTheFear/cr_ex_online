import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { FaAngleDown } from "react-icons/fa";

import { languages } from "../../data/languageItems";

import classes from "./LanguageSelector.module.scss";

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const selectedElem = useRef<HTMLDivElement>(null);
  const optionsListElem = useRef<HTMLDivElement>(null);

  const [isOpenedOptions, setIsOpenedOptions] = useState(false);

  const currentLang = router.query.lang;
  const languagesOpts = languages.map((lang) => lang.name).filter((lang) => lang !== currentLang);

  const toggleIsOpenedOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLDivElement;
    if (isOpenedOptions) {
      elem.style.borderWidth = "0";
      elem.style.marginTop = "";
      elem.style.height = "0";
    } else {
      const borderWidth = 1;
      elem.style.borderWidth = `${borderWidth}px`;
      elem.style.marginTop = "0.5rem";
      elem.style.height = elem.scrollHeight + borderWidth * 2 + "px";
    }
    setIsOpenedOptions((prevState) => !prevState);
  }, [isOpenedOptions]);

  const closeLangsOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLDivElement;
    elem.style.borderWidth = "0";
    elem.style.height = "0";
    elem.style.marginTop = "";
    setIsOpenedOptions(false);
  }, []);

  const changeLanguage = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const languageName = e.currentTarget.getAttribute("data-name");
    router.push({
      pathname: router.pathname,
      query: { lang: languageName }
    });
    // disable the linting on the next line - This is the cleanest solution according to Nextjs.org
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeOpenedOptions = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === selectedElem.current) {
          return;
        }
        const parentElement = element.parentElement;
        if (parentElement) {
          element = parentElement;
        } else {
          return;
        }
      }
      if (isOpenedOptions) {
        closeLangsOptions();
      }
    },
    [closeLangsOptions, isOpenedOptions]
  );

  useEffect(() => {
    window.addEventListener("click", closeOpenedOptions);
    return () => {
      window.removeEventListener("click", closeOpenedOptions);
    };
  }, [closeOpenedOptions]);

  return (
    <div className={classes["language-selector"]}>
      <div
        className={classes["language-selector__selected"]}
        onClick={toggleIsOpenedOptions}
        ref={selectedElem}
      >
        <span className={classes["language-selector__selected-name"]}>{currentLang}</span>
        <span>
          <FaAngleDown
            className={
              `${classes["language-selector__select-arrow"]}` +
              (isOpenedOptions ? ` ${classes["language-selector__select-arrow_is-opened"]}` : ``)
            }
          />
        </span>
      </div>
      <div className={classes["language-selector__select-options"]} ref={optionsListElem}>
        {languagesOpts.map((lang) => (
          <div
            className={classes["language-selector__select-options-item"]}
            data-name={lang}
            onClick={changeLanguage}
            key={lang}
          >
            {lang}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
