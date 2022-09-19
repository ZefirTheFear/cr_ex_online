import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCallback, useState } from "react";

import { FaAngleDown, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaUser } from "react-icons/fa";
import { ImUserPlus } from "react-icons/im";

import DropdownList from "../DropdownList/DropdownList";

import { Languages } from "../../models/language";
import { AuthMode } from "../AuthForm/AuthForm";

import classes from "./UserOptions.module.scss";

interface UserOptionsProps {
  lang: Languages;
}

const UserOptions: React.FC<UserOptionsProps> = ({ lang }) => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [isOpenUserOptions, setisOpenUserOptions] = useState(false);

  const logOut = useCallback(async () => {
    const data = await signOut({ redirect: false, callbackUrl: `/${lang}` });
    router.push(data.url);
  }, [lang, router]);

  return (
    <div className={classes["user-options"]}>
      <DropdownList
        isOpenOptions={isOpenUserOptions}
        setIsOpenOptions={setisOpenUserOptions}
        toggler={
          <>
            <div
              className={
                `${classes["user-options__toggler"]}` +
                (session ? ` ${classes["user-options__toggler_authenticated"]}` : ``)
              }
            >
              <span className={classes["user-options__toggler-icon"]}>
                <FaUserCircle />
              </span>
              <span
                className={
                  `${classes["user-options__toggler-arrow"]}` +
                  (isOpenUserOptions ? ` ${classes["user-options__toggler-arrow_open"]}` : ``)
                }
              >
                <FaAngleDown />
              </span>
            </div>
          </>
        }
        options={
          <>
            <ul className={classes["user-options__list"]}>
              {!session && status !== "loading" && (
                <>
                  <li className={classes["user-options__list-item"]}>
                    <Link
                      href={`/${encodeURIComponent(lang)}/auth/${encodeURIComponent(
                        AuthMode.login
                      )}`}
                    >
                      <a>
                        <span className={classes["user-options__list-item-icon"]}>
                          <FaSignInAlt />
                        </span>
                        <span className={classes["user-options__list-item-title"]}>
                          {lang === Languages.en
                            ? "Login"
                            : lang === Languages.ua
                            ? "Увійти"
                            : "Войти"}
                        </span>
                      </a>
                    </Link>
                  </li>
                  <li className={classes["user-options__list-item"]}>
                    <Link
                      href={`/${encodeURIComponent(lang)}/auth/${encodeURIComponent(
                        AuthMode.register
                      )}`}
                    >
                      <a>
                        <span className={classes["user-options__list-item-icon"]}>
                          <ImUserPlus />
                        </span>
                        <span className={classes["user-options__list-item-title"]}>
                          {lang === Languages.en
                            ? "Register"
                            : lang === Languages.ua
                            ? "Реєстрація"
                            : "Регистрация"}
                        </span>
                      </a>
                    </Link>
                  </li>
                </>
              )}
              {session && (
                <>
                  <li className={classes["user-options__list-item"]}>
                    <Link href={`/${encodeURIComponent(lang)}/profile`}>
                      <a>
                        <span className={classes["user-options__list-item-icon"]}>
                          <FaUser />
                        </span>
                        <span className={classes["user-options__list-item-title"]}>
                          {lang === Languages.en
                            ? "My profile"
                            : lang === Languages.ua
                            ? "Мій профіль"
                            : "Мой профиль"}
                        </span>
                      </a>
                    </Link>
                  </li>
                  <li className={classes["user-options__list-item"]} onClick={logOut}>
                    <div className={classes["user-options__logout-container"]}>
                      <span className={classes["user-options__list-item-icon"]}>
                        <FaSignOutAlt />
                      </span>
                      <span className={classes["user-options__list-item-title"]}>
                        {lang === Languages.en
                          ? "Logout"
                          : lang === Languages.ua
                          ? "Вийти"
                          : "Выйти"}
                      </span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </>
        }
        rightSided
      />
    </div>
  );
};

export default UserOptions;
