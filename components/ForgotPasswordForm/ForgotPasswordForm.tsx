import { useCallback, useRef } from "react";
import { useRouter } from "next/router";

import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";

import classes from "./ForgotPasswordForm.module.scss";

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);

  const getPassword = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(emailInput.current?.value);
  }, []);

  return (
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
            ref={emailInput}
          />
        </div>
        <div className={classes["forgot-password__form-row"]}>
          <button className={classes["forgot-password__submit-btn"]} type="submit">
            {language === Languages.en
              ? "Submit"
              : language === Languages.ua
              ? "Відправити"
              : "Отправить"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
