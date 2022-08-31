import { useCallback, useRef } from "react";
import { useRouter } from "next/router";

import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";

import classes from "./LoginForm.module.scss";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const login = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(emailInput.current?.value);
    console.log(passwordInput.current?.value);
  }, []);

  return (
    <div className={classes.login}>
      <form onSubmit={login} noValidate>
        <div className={classes["login__form-row"]}>
          <AuthInputGroup
            title="Email"
            type={AuthInputGroupType.email}
            placeholder={
              language === Languages.en
                ? "Enter your email"
                : language === Languages.ua
                ? "Введіть ваш email"
                : "Введите ваш email"
            }
            ref={emailInput}
          />
        </div>
        <div className={classes["login__form-row"]}>
          <AuthInputGroup
            title={language === Languages.en ? "Password" : "Пароль"}
            type={AuthInputGroupType.password}
            placeholder={
              language === Languages.en
                ? "Enter your password"
                : language === Languages.ua
                ? "Введіть ваш пароль"
                : "Введите ваш пароль"
            }
            ref={passwordInput}
          />
        </div>
        <div className={classes["login__form-row"]}>
          <button className={classes["login__submit-btn"]} type="submit">
            {language === Languages.en ? "Login" : language === Languages.ua ? "Увійти" : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
