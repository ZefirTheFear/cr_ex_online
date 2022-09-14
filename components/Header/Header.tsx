import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { FaAngleDown, FaSignInAlt, FaUserCircle } from "react-icons/fa";

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

  const userElem = useRef<HTMLDivElement>(null);
  const userOptionsListElem = useRef<HTMLUListElement>(null);

  const [isOpenUserOptions, setIsOpenUserOptions] = useState(false);

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

  const logOut = useCallback(
    async () => {
      const data = await signOut({ redirect: false, callbackUrl: `/${lang}` });
      router.push(data.url);
    },
    // disable the linting on the next line - This is the cleanest solution according to Nextjs.org
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const toggleUserOptions = useCallback(() => {
    const elem = userOptionsListElem.current as HTMLUListElement;
    if (isOpenUserOptions) {
      elem.style.borderWidth = "0";
      elem.style.height = "0";
    } else {
      const borderWidth = 1;
      elem.style.borderWidth = `${borderWidth}px`;
      elem.style.height = elem.scrollHeight + borderWidth * 2 + "px";
    }
    setIsOpenUserOptions((prevState) => !prevState);
  }, [isOpenUserOptions]);

  const closeUserOptions = useCallback(() => {
    const elem = userOptionsListElem.current as HTMLUListElement;
    elem.style.borderWidth = "0";
    elem.style.height = "0";
    setIsOpenUserOptions(false);
  }, []);

  const closeOpenedUserOptions = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === userElem.current) {
          return;
        }
        const parentElement = element.parentElement;
        if (parentElement) {
          element = parentElement;
        } else {
          return;
        }
      }
      if (isOpenUserOptions) {
        closeUserOptions();
      }
    },
    [closeUserOptions, isOpenUserOptions]
  );

  useEffect(() => {
    window.addEventListener("click", closeOpenedUserOptions);
    return () => {
      window.removeEventListener("click", closeOpenedUserOptions);
    };
  }, [closeOpenedUserOptions]);

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
        {!session && status !== "loading" && (
          <div className={classes["header__auth-container"]}>
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
        )}
        {session && (
          <div className={classes["header__user-container"]}>
            <div className={classes.header__user} onClick={toggleUserOptions} ref={userElem}>
              <span className={classes["header__user-icon"]}>
                <FaUserCircle />
              </span>
              <span
                className={
                  `${classes["header__user-arrow"]}` +
                  (isOpenUserOptions ? ` ${classes["header__user-arrow_open"]}` : ``)
                }
              >
                <FaAngleDown />
              </span>
            </div>
            <ul
              className={
                `${classes["header__user-options"]}` +
                (isOpenUserOptions ? ` ${classes["header__user-options_open"]}` : ``)
              }
              ref={userOptionsListElem}
            >
              <li className={classes["header__user-options-item"]}>
                <Link href={`/${encodeURIComponent(lang)}/profile`}>
                  {lang === Languages.en
                    ? "My profile"
                    : lang === Languages.ua
                    ? "Мій профіль"
                    : "Мой профиль"}
                </Link>
              </li>
              <li
                className={
                  `${classes["header__user-options-item"]}` +
                  ` ${classes["header__user-options-item_with-padding"]}`
                }
                onClick={logOut}
              >
                {lang === Languages.en ? "Logout" : lang === Languages.ua ? "Вийти" : "Выйти"}
              </li>
            </ul>
          </div>
        )}
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
