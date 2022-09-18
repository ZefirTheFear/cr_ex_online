import Link from "next/link";
import { useMemo, useCallback, useEffect } from "react";

import LanguageSelector from "../LanguageSelector/LanguageSelector";

import Logo from "../../assets/logo/logo_full.svg";

import { Languages } from "../../models/language";

import navigatationItems, { navItemRole } from "../../data/navItems";

import { useAppDispatch, useAppSelector } from "../../utils/ts/hooks";
import { toggleMobileMenu, closeMobileMenu } from "../../store/reducers/mobileMenuSlice";

import classes from "./Header.module.scss";
import NavItemDropdownList from "../NavItemDropdownList/NavItemDropdownList";
import UserOptions from "../UserOptions/UserOptions";

interface HeaderProps {
  lang: Languages;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const isMobileMenuOpen = useAppSelector((state) => state.mobileMenuState.isOpen);
  const dispatch = useAppDispatch();

  const navItems = useMemo(() => {
    return navigatationItems(lang);
  }, [lang]);

  const onClickLogo = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const closeMobMenu = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

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
        <div className={classes.header__logo} onClick={onClickLogo}>
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
                `${classes["header__menu-item-container"]}` +
                (isMobileMenuOpen ? ` ${classes["header__menu-item-container_open"]}` : ``)
              }
              key={item.id}
            >
              {item.role === navItemRole.list ? (
                <NavItemDropdownList title={item.title} list={item.sublist} />
              ) : (
                <div className={classes["header__menu-item-link-container"]} onClick={closeMobMenu}>
                  {item.url && (
                    <Link href={item.url}>
                      <a>{item.title}</a>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
        <LanguageSelector />
        <UserOptions lang={lang} />
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
