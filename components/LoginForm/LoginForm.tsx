import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import cloneDeep from "clone-deep";
import { signIn } from "next-auth/react";

import PageSpinner from "../PageSpinner/PageSpinner";
import Modal from "../Modal/Modal";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import { ILoginData, ILoginInputErrors, loginValidation } from "../../utils/ts/validations";

import classes from "./LoginForm.module.scss";

enum LoginInputFieldName {
  email = "email",
  password = "password"
}

export enum LoginInputErrorType {
  email = "email",
  password = "password",
  db = "db"
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const [inputErrors, setInputErrors] = useState<ILoginInputErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      const fieldName = e.target.name as LoginInputFieldName;
      delete newErrors[fieldName];
      setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const login = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!emailInput.current || !passwordInput.current) {
        return new Error("no inputs");
      }

      const loginData: ILoginData = {
        email: emailInput.current.value.toLowerCase().trim(),
        password: passwordInput.current.value.trim(),
        language: language
      };

      const loginInputErrors = loginValidation(loginData);
      console.log("loginInputErrors: ", loginInputErrors);
      if (loginInputErrors) {
        return setInputErrors(loginInputErrors);
      }

      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: loginData.email,
          password: loginData.password,
          language: loginData.language
        });
        console.log("loginResult: ", result);

        if (!result) {
          setIsSomethingWentWrong(true);
          setIsLoading(false);
          return;
        }

        if (result.error) {
          switch (result.error as LoginInputErrorType) {
            case LoginInputErrorType.db: {
              setIsSomethingWentWrong(true);
              setIsLoading(false);
              return;
            }
            case LoginInputErrorType.email: {
              const error: ILoginInputErrors = {
                email: [
                  language === Languages.en
                    ? "no such user exists"
                    : language === Languages.ua
                    ? "такого користувача не існує"
                    : "такого пользователя не существует"
                ]
              };
              setInputErrors(error);
              setIsLoading(false);
              return;
            }
            case LoginInputErrorType.password: {
              const error: ILoginInputErrors = {
                password: [
                  language === Languages.en
                    ? "wrong password"
                    : language === Languages.ua
                    ? "неправильний пароль"
                    : "неправильный пароль"
                ]
              };
              setInputErrors(error);
              setIsLoading(false);
              return;
            }

            default:
              setIsSomethingWentWrong(true);
              setIsLoading(false);
              return;
          }
        }

        router.push(`/${language}`);
      } catch (error) {
        console.log("error: ", error);
        setIsSomethingWentWrong(true);
        setIsLoading(false);
        return;
      }
    },
    [language, router]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  return (
    <>
      {isLoading && <PageSpinner />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "Something went wrong. Try again later"
              : language === Languages.ua
              ? "Щось пішло не так. Cпробуйте пізніше"
              : "Что-то пошло не так. Попробуйте позже"
          }
        />
      )}
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
              name={LoginInputFieldName.email}
              errors={inputErrors.email ? inputErrors.email : null}
              ref={emailInput}
              onFocus={focusInput}
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
              name={LoginInputFieldName.password}
              errors={inputErrors.password ? inputErrors.password : null}
              ref={passwordInput}
              onFocus={focusInput}
            />
          </div>
          <div className={classes["login__form-row"]}>
            <button className={classes["login__submit-btn"]} type="submit">
              {language === Languages.en ? "Login" : language === Languages.ua ? "Увійти" : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
