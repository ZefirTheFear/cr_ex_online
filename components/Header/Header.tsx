import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useCallback, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

import LanguageSelector from "../LanguageSelector/LanguageSelector";

import Logo from "../../assets/logo/logo_full.svg";

import { Languages } from "../../models/language";

import navigatationItems, { navItemRole } from "../../data/navItems";

import { useAppDispatch, useAppSelector } from "../../utils/ts/hooks";
import { toggleMobileMenu, closeMobileMenu } from "../../store/reducers/mobileMenuSlice";

import classes from "./Header.module.scss";
import NavItemDropdownList from "../NavItemDropdownList/NavItemDropdownList";

interface HeaderProps {
  lang: Languages;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const isMobileMenuOpen = useAppSelector((state) => state.mobileMenuState.isOpen);
  const dispatch = useAppDispatch();

  const navItems = useMemo(() => {
    return navigatationItems(lang);
  }, [lang]);

  const toggleMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const closeMobMenu = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const logOut = useCallback(
    async () => {
      const data = await signOut({ redirect: false, callbackUrl: `/${lang}` });
      router.push(data.url);
    },
    // disable the linting on the next line - This is the cleanest solution according to Nextjs.org
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
        <div className={classes.header__logo} onClick={closeMobMenu}>
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
        <div className={classes["header__auth-container"]}>
          {!session && status !== "loading" && (
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
          )}
          {session && <div onClick={logOut}>LogOut</div>}
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
