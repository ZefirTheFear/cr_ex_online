import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import cloneDeep from "clone-deep";

import PageSpinner from "../PageSpinner/PageSpinner";
import Modal from "../Modal/Modal";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import {
  forgotPasswordValidation,
  IForgotPasswordData,
  IForgotPasswordInputErrors
} from "../../utils/ts/validations";

import classes from "./ForgotPasswordForm.module.scss";

enum ForgotPasswordInputFieldName {
  email = "email"
}

interface ForgotPasswordFormProps {
  goToLoginForm: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ goToLoginForm }) => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);

  const [inputErrors, setInputErrors] = useState<IForgotPasswordInputErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      const fieldName = e.target.name as ForgotPasswordInputFieldName;
      delete newErrors[fieldName];
      setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const getPassword = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!emailInput.current) {
        return new Error("no inputs");
      }

      const forgotPasswordData: IForgotPasswordData = {
        email: emailInput.current.value.toLowerCase().trim(),
        language: language
      };

      const forgotPasswordInputErrors = forgotPasswordValidation(forgotPasswordData);
      console.log("forgotPasswordInputErrors: ", forgotPasswordInputErrors);
      if (forgotPasswordInputErrors) {
        return setInputErrors(forgotPasswordInputErrors);
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/get-new-password", {
          method: "POST",
          body: JSON.stringify(forgotPasswordData),
          headers: {
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });
        console.log(response);

        if (response.status === 422) {
          const data = (await response.json()) as { inputErrors: IForgotPasswordInputErrors };
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
    [controller.signal, language]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    goToLoginForm();
  }, [goToLoginForm]);

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
              ? "A new password has been sent to your email"
              : language === Languages.ua
              ? "Новий пароль надіслано вам на email"
              : "Новый пароль выслан вам на email"
          }
        />
      )}
      <div className={classes["forgot-password"]}>
        <form onSubmit={getPassword} noValidate>
          <div className={classes["forgot-password__form-row"]}>
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
              name={ForgotPasswordInputFieldName.email}
              errors={inputErrors.email ? inputErrors.email : null}
              onFocus={focusInput}
              ref={emailInput}
            />
          </div>
          <div className={classes["forgot-password__form-row"]}>
            <button className={classes["forgot-password__submit-btn"]} type="submit">
              {language === Languages.en
                ? "Get a new password"
                : language === Languages.ua
                ? "Отримати новий пароль"
                : "Получить новый пароль"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
