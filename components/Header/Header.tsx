import Link from "next/link";
import { useMemo, useCallback, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";

import LanguageSelector from "../LanguageSelector/LanguageSelector";

import Logo from "../../assets/logo/logo_full.svg";

import { Languages } from "../../models/language";

import navItemsFn from "../../data/navItems";

import { useAppDispatch, useAppSelector } from "../../utils/ts/hooks";
import { toggleMobileMenu, closeMobileMenu } from "../../store/reducers/mobileMenuSlice";

import classes from "./Header.module.scss";

interface HeaderProps {
  lang: Languages;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const isMobileMenuOpen = useAppSelector((state) => state.mobileMenuState.isOpen);
  const dispatch = useAppDispatch();

  const navItems = useMemo(() => {
    return navItemsFn(lang);
  }, [lang]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const clickMenuItem = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const itemId = e.currentTarget.dataset.id;
      console.log("itemId", itemId);
      dispatch(closeMobileMenu());
    },
    [dispatch]
  );

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
        <div className={classes.header__logo}>
          <Link href={`/${encodeURIComponent(lang)}/`}>
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        <nav className={classes.header__menu}>
          {navItems.map((item) => (
            <div
              className={
                `${classes["header__menu-item"]}` +
                (isMobileMenuOpen ? ` ${classes["header__menu-item_open"]}` : ``)
              }
              key={item.id}
              data-id={item.id}
              onClick={clickMenuItem}
            >
              {item.title}
            </div>
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
