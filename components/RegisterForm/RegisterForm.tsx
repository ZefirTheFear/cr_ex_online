import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cloneDeep from "clone-deep";
import { signIn } from "next-auth/react";

import PageSpinner from "../PageSpinner/PageSpinner";
import Modal from "../Modal/Modal";
import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import { Languages } from "../../models/language";
import {
  ILoginData,
  IRegisterData,
  IRegisterInputErrors,
  registerValidation
} from "../../utils/ts/validations";

import classes from "./RegisterForm.module.scss";

enum RegisterInputFieldName {
  name = "name",
  email = "email",
  phone = "phone",
  password = "password",
  checkbox = "checkbox"
}

const RegisterForm: React.FC = () => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const [isTermsAgreed, setIsTermsAgreed] = useState(true);
  const [inputErrors, setInputErrors] = useState<IRegisterInputErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCheckbox = useCallback(() => {
    setIsTermsAgreed((prevState) => !prevState);
    const newErrors = cloneDeep(inputErrors);
    delete newErrors["checkbox"];
    setInputErrors(newErrors);
  }, [inputErrors]);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      const fieldName = e.target.name as RegisterInputFieldName;
      delete newErrors[fieldName];
      setInputErrors(newErrors);
    },
    [inputErrors]
  );

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
        name: nameInput.current.value.trim(),
        email: emailInput.current.value.toLowerCase().trim(),
        phone: phoneInput.current.value.trim(),
        password: passwordInput.current.value.trim(),
        isTermsAgreed: isTermsAgreed,
        language: language
      };

      const registerInputErrors = registerValidation(registerData);
      console.log("registerInputErrors: ", registerInputErrors);
      if (registerInputErrors) {
        return setInputErrors(registerInputErrors);
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/register-user", {
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
          setInputErrors(data.inputErrors);
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

        const data = await response.json();
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
    [controller.signal, isTermsAgreed, language]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  // const closeSuccessModal = useCallback(() => {
  //   router.push(`/${encodeURIComponent(language)}/auth/login`);
  // }, [language, router]);

  const closeSuccessModal = useCallback(async () => {
    if (!emailInput.current || !passwordInput.current) {
      return new Error("no inputs");
    }

    const loginData: ILoginData = {
      email: emailInput.current.value.toLowerCase().trim(),
      password: passwordInput.current.value.trim(),
      language: language
    };

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
        language: loginData.language
      });
      console.log("loginResult: ", result);

      if (!result || result.error) {
        setIsSomethingWentWrong(true);
        setIsLoading(false);
        return;
      }

      router.replace(`/${encodeURIComponent(language)}`);
    } catch (error) {
      setIsSomethingWentWrong(true);
      setIsLoading(false);
      return;
    }
  }, [language, router]);

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

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
      {isSuccess && (
        <Modal
          closeModal={closeSuccessModal}
          msg={
            language === Languages.en
              ? "You are registered"
              : language === Languages.ua
              ? "Ви зараєстровані"
              : "Вы зарегистированны"
          }
        />
      )}
      <div className={classes.register}>
        <form onSubmit={registerUser} noValidate>
          <div className={classes["register__form-row"]}>
            <InputGroup
              title={
                language === Languages.en ? "Name" : language === Languages.ua ? "Ім'я" : "Имя"
              }
              type={InputGroupType.text}
              placeholder={
                language === Languages.en
                  ? "Enter your name"
                  : language === Languages.ua
                  ? "Введіть ваше ім'я"
                  : "Введите ваше имя"
              }
              name={RegisterInputFieldName.name}
              errors={inputErrors.name ? inputErrors.name : null}
              ref={nameInput}
              onFocus={focusInput}
            />
            <InputGroup
              title="Email"
              type={InputGroupType.email}
              placeholder={
                language === Languages.en
                  ? "Enter your email"
                  : language === Languages.ua
                  ? "Введіть ваш email"
                  : "Введите ваш email"
              }
              name={RegisterInputFieldName.email}
              errors={inputErrors.email ? inputErrors.email : null}
              ref={emailInput}
              onFocus={focusInput}
            />
          </div>
          <div className={classes["register__form-row"]}>
            <InputGroup
              title={language === Languages.en ? "Phone number" : "Телефон"}
              type={InputGroupType.tel}
              placeholder={
                language === Languages.en
                  ? "Enter your phone number"
                  : language === Languages.ua
                  ? "Введіть ваш телефон"
                  : "Введите ваш телефон"
              }
              name={RegisterInputFieldName.phone}
              errors={inputErrors.phone ? inputErrors.phone : null}
              ref={phoneInput}
              onFocus={focusInput}
            />
            <InputGroup
              title={language === Languages.en ? "Password" : "Пароль"}
              type={InputGroupType.password}
              placeholder={
                language === Languages.en
                  ? "Enter your password"
                  : language === Languages.ua
                  ? "Введіть ваш пароль"
                  : "Введите ваш пароль"
              }
              name={RegisterInputFieldName.password}
              errors={inputErrors.password ? inputErrors.password : null}
              ref={passwordInput}
              onFocus={focusInput}
            />
          </div>
          <div className={classes["register__form-row"]}>
            <div>
              <div className={classes.register__terms}>
                <div className={classes["register__checkbox-container"]}>
                  <input
                    type="checkbox"
                    className={
                      `${classes.register__checkbox}` +
                      (inputErrors.checkbox ? ` ${classes.register__checkbox_invalid}` : ``)
                    }
                    checked={isTermsAgreed}
                    name={RegisterInputFieldName.checkbox}
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
              {inputErrors.checkbox && <InvalidFeedback msg={inputErrors.checkbox} />}
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
