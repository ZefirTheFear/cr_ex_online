import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import {
  IRegisterData,
  IRegisterInputErrors,
  registerValidation
} from "../../utils/ts/validations";

import classes from "./RegisterForm.module.scss";

const RegisterForm: React.FC = () => {
  const controller = new AbortController();

  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [inputErrors, setinputErrors] = useState<IRegisterInputErrors>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCheckbox = useCallback(() => {
    setIsTermsAgreed((prevState) => !prevState);
  }, []);

  const registerUser = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (
        !nameInput.current ||
        !emailInput.current ||
        !phoneInput.current ||
        !passwordInput.current
      ) {
        return new Error("no inputs");
      }

      const registerData: IRegisterData = {
        name: nameInput.current.value,
        email: emailInput.current.value,
        phone: phoneInput.current.value,
        password: passwordInput.current.value,
        language: language
      };

      const registerInputErrors = registerValidation(registerData);
      console.log("registerInputErrors: ", registerInputErrors);
      if (registerInputErrors) {
        return setinputErrors(registerInputErrors);
      }

      // TODO checkbox

      setIsLoading(true);
      try {
        const response = await fetch("/api/register-user", {
          method: "POST",
          body: JSON.stringify(registerData),
          headers: {
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });
        console.log(response);

        if (response.status === 422) {
          const data = (await response.json()) as { inputErrors: IRegisterInputErrors };
          setinputErrors(data.inputErrors);
          setIsLoading(false);
          return;
        }

        if (response.status === 503) {
          const data = (await response.json()) as { message: string };
          console.log(data);
          setIsSomethingWentWrong(true);
          setIsLoading(false);
          return;
        }

        if (response.status === 200) {
          setIsSuccess(true);
          setIsLoading(false);
          return;
        }

        const data = (await response.json()) as { message: string };
        console.log(data);
        setIsLoading(false);
        return;
      } catch (error) {
        console.log("error: ", error);
        setIsSomethingWentWrong(true);
        setIsLoading(false);
        return;
      }
    },
    [language]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    router.push(`/${language}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "something went wrong. try again"
              : language === Languages.ua
              ? "Щось пішло не так"
              : "Что-то пошло не так"
          }
        />
      )}
      {isSuccess && (
        <Modal
          closeModal={closeSuccessModal}
          msg={
            language === Languages.en
              ? "you are registered"
              : language === Languages.ua
              ? "ви зараєстровані"
              : "вы зарегистированны"
          }
        />
      )}
      <div className={classes.register}>
        <form onSubmit={registerUser} noValidate>
          <div className={classes["register__form-row"]}>
            <AuthInputGroup
              title={
                language === Languages.en ? "Name" : language === Languages.ua ? "Ім'я" : "Имя "
              }
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
                <input
                  type="checkbox"
                  className={classes.register__checkbox}
                  checked={isTermsAgreed}
                  onChange={toggleCheckbox}
                />
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
              {language === Languages.en
                ? "Register"
                : language === Languages.ua
                ? "Зареєструватися"
                : "Зарегистрироваться"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
