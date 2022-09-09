import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import cloneDeep from "clone-deep";
import { signIn } from "next-auth/react";

import Spinner from "../Spinner/Spinner";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import { ILoginData, ILoginInputErrors, loginValidation } from "../../utils/ts/validations";

import classes from "./LoginForm.module.scss";

enum LoginInputFields {
  email = "email",
  password = "password"
}

const LoginForm: React.FC = () => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

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
      const fieldName = e.target.name as LoginInputFields;
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
        // TODO
        const result = await signIn("credentials", {
          redirect: false,
          email: loginData.email,
          password: loginData.password,
          language: loginData.language
        });
        console.log("loginResult: ", result);
        router.push(`/${language}`);
        setIsLoading(false);
      } catch (error) {
        // TODO
      }
    },
    [language]
  );

  return (
    <>
      {isLoading && <Spinner />}
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
              name={LoginInputFields.email}
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
              name={LoginInputFields.password}
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
