import Link from "next/link";
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";

import LanguageSelector from "../LanguageSelector/LanguageSelector";

import Logo from "../../assets/logo/logo_full.svg";

import { Languages } from "../../models/language";

import navigatationItems, { exchangeOptions, navItemRole } from "../../data/navItems";

import { useAppDispatch, useAppSelector } from "../../utils/ts/hooks";
import { toggleMobileMenu, closeMobileMenu } from "../../store/reducers/mobileMenuSlice";

import classes from "./Header.module.scss";

interface HeaderProps {
  lang: Languages;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const isMobileMenuOpen = useAppSelector((state) => state.mobileMenuState.isOpen);
  const dispatch = useAppDispatch();

  const exchangeElem = useRef<HTMLDivElement>(null);
  const optionsListElem = useRef<HTMLUListElement>(null);

  const [isExchangeOptionsOpen, setIsExchangeOptionsOpen] = useState(false);

  const navItems = useMemo(() => {
    return navigatationItems(lang);
  }, [lang]);

  const navExchangeOptions = useMemo(() => {
    return exchangeOptions(lang);
  }, [lang]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const clickLogo = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const clickMenuItem = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const itemId = e.currentTarget.dataset.id;
      console.log("itemId", itemId);
      setIsExchangeOptionsOpen((prevState) => !prevState);
      dispatch(closeMobileMenu());
    },
    [dispatch]
  );

  const toggleIsOpenedOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLUListElement;
    if (isExchangeOptionsOpen) {
      elem.style.borderWidth = "0";
      elem.style.marginTop = "";
      elem.style.height = "0";
    } else {
      const borderWidth = 1;
      elem.style.borderWidth = `${borderWidth}px`;
      elem.style.marginTop = "0.75rem";
      elem.style.height = elem.scrollHeight + borderWidth * 2 + "px";
    }
    setIsExchangeOptionsOpen((prevState) => !prevState);
  }, [isExchangeOptionsOpen]);

  const closeExchangeOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLUListElement;
    elem.style.borderWidth = "0";
    elem.style.height = "0";
    elem.style.marginTop = "";
    setIsExchangeOptionsOpen(false);
  }, []);

  const closeOpenedOptions = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === exchangeElem.current) {
          return;
        }
        const parentElement = element.parentElement;
        if (parentElement) {
          element = parentElement;
        } else {
          return;
        }
      }
      if (isExchangeOptionsOpen) {
        closeExchangeOptions();
      }
    },
    [closeExchangeOptions, isExchangeOptionsOpen]
  );

  useEffect(() => {
    window.addEventListener("click", closeOpenedOptions);
    return () => {
      window.removeEventListener("click", closeOpenedOptions);
    };
  }, [closeOpenedOptions]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <header className={classes.header}>
      <div className={classes.header__inner}>
        <div className={classes.header__logo} onClick={clickLogo}>
          <Link href={`/${encodeURIComponent(lang)}/`}>
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        <nav className={classes.header__menu}>
          {navItems.map((item) => (
            <>
              <div
                className={
                  `${classes["header__menu-item-container"]}` +
                  (isMobileMenuOpen ? ` ${classes["header__menu-item-container_open"]}` : ``)
                }
                key={item.id}
                data-id={item.id}
                // onClick={clickMenuItem}
              >
                {item.role === navItemRole.list ? (
                  <>
                    <div
                      className={classes["header__menu-item"]}
                      onClick={toggleIsOpenedOptions}
                      ref={exchangeElem}
                    >
                      {item.title}
                    </div>
                    <ul
                      className={
                        `${classes["header__exchange-options"]}` +
                        (isExchangeOptionsOpen
                          ? ` ${classes["header__exchange-options_open"]}`
                          : ``)
                      }
                      ref={optionsListElem}
                    >
                      options
                    </ul>
                  </>
                ) : (
                  <Link href={item.url}>{item.title}</Link>
                )}
              </div>
            </>
          ))}
        </nav>
        <LanguageSelector />
        <div className={classes["header__auth-btn-container"]}>
          <Link href={`/${encodeURIComponent(lang)}/auth`}>
            <a>
              <button className={classes["header__auth-btn"]} type="button">
                <span className={classes["header__auth-btn-title"]}>
                  {lang === Languages.en ? "Login" : lang === Languages.ua ? "Увійти" : "Войти"}
                </span>
                <span className={classes["header__auth-icon"]}>
                  <FaSignInAlt />
                </span>
              </button>
            </a>
          </Link>
        </div>
        <div
          className={
            `${classes["header__menu-btn"]}` +
            (isMobileMenuOpen ? ` ${classes["header__menu-btn_close"]}` : ``)
          }
          onClick={toggleMenu}
        >
          <div className={classes["header__menu-btn-line"]}></div>
          <div className={classes["header__menu-btn-line"]}></div>
          <div className={classes["header__menu-btn-line"]}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
