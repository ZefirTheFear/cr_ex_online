import React, { useMemo, useCallback } from "react";

import LanguageSelector from "../LanguageSelector/LanguageSelector";

import Logo from "../../assets/logo/logo_full.svg";

import navItemsFn from "../../data/navItems";

import { useAppDispatch, useAppSelector } from "../../utils/ts/hooks";
import { toggleMobileMenu } from "../../store/reducers/mobileMenuSlice";

import classes from "./Header.module.scss";

interface HeaderProps {
  lang: "ua" | "en" | "ru";
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

  return (
    <header className={classes.header}>
      <div className={classes.header__inner}>
        <div className={classes.header__logo}>
          <Logo />
        </div>
        <nav className={classes.header__menu}>
          {navItems.map((item) => (
            <div className={classes["header__menu-item"]} key={item.id}>
              {item.title}
            </div>
          ))}
        </nav>
        <LanguageSelector />
        <div className={classes.header__auth}>Auth</div>
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
