import { useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";

import classes from "./RegisterForm.module.scss";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const register = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(emailInput.current?.value);
    console.log(passwordInput.current?.value);
  }, []);

  return (
    <div className={classes.register}>
      <form onSubmit={register} noValidate>
        <div className={classes["register__form-row"]}>
          <AuthInputGroup
            title={language === Languages.en ? "Name" : language === Languages.ua ? "Ім'я" : "Имя "}
            type={AuthInputGroupType.text}
            placeholder={
              language === Languages.en
                ? "Enter your name"
                : language === Languages.ua
                ? "Введіть ваше ім'я"
                : "Введите ваше имя"
            }
            ref={nameInput}
          />
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
        <div className={classes["register__form-row"]}>
          <AuthInputGroup
            title={language === Languages.en ? "Phone number" : "Телефон"}
            type={AuthInputGroupType.tel}
            placeholder={
              language === Languages.en
                ? "Enter your phone number"
                : language === Languages.ua
                ? "Введіть ваш телефон"
                : "Введите ваш телефон"
            }
            ref={phoneInput}
          />
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
        <div className={classes["register__form-row"]}>
          <div className={classes.register__terms}>
            <div>
              <input type="checkbox" className={classes.register__checkbox} />
            </div>
            <div className={classes["register__terms-text"]}>
              {language === Languages.en
                ? "I have read and agree to "
                : language === Languages.ua
                ? "Я ознайомлений та згоден з "
                : "Я ознакомлен и согласен с "}
              <span className={classes["register__terms-link"]}>
                <Link href={`/${encodeURIComponent(language)}/terms-and-conditions`}>
                  {language === Languages.en
                    ? "Terms of use"
                    : language === Languages.ua
                    ? "Правилами використання сайту"
                    : "Правилами использования сайта"}
                </Link>
              </span>
              {language === Languages.en ? " and " : language === Languages.ua ? " та " : " и "}
              <span className={classes["register__terms-link"]}>
                <Link href={`/${encodeURIComponent(language)}/privacy-policy`}>
                  {language === Languages.en
                    ? "Privacy policy"
                    : language === Languages.ua
                    ? "Політикою конфіденційності"
                    : "Политикой конфиденциальности"}
                </Link>
              </span>
            </div>
          </div>
          <button className={classes["register__submit-btn"]} type="submit">
            {language === Languages.en ? "Login" : language === Languages.ua ? "Увійти" : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
