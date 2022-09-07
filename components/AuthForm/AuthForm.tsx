import { useCallback, useState } from "react";
import { useRouter } from "next/router";

import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import ForgotPasswordForm from "../ForgotPasswordForm/ForgotPasswordForm";

import { Languages } from "../../models/language";

import classes from "./AuthForm.module.scss";

enum AuthMode {
  login = "login",
  register = "register",
  forgotPassword = "forgotPassword"
}

const AuthForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.login);

  // const setAuthModeToRegister = useCallback(() => {
  //   return setAuthMode(AuthMode.register);
  // }, []);
  const setAuthModeToLogin = useCallback(() => {
    return setAuthMode(AuthMode.login);
  }, []);

  const setAuthModeToForgotPassword = useCallback(() => {
    return setAuthMode(AuthMode.forgotPassword);
  }, []);

  const changeAuthMode = useCallback(() => {
    return setAuthMode((prev) => {
      if (prev === AuthMode.login) {
        return AuthMode.register;
      } else {
        return AuthMode.login;
      }
    });
  }, []);

  return (
    <div className={classes["auth-form"]}>
      <h2 className={classes["auth-form__heading"]}>
        {authMode === AuthMode.login
          ? language === Languages.en
            ? "Login"
            : language === Languages.ua
            ? "Вхід"
            : "Вход"
          : authMode === AuthMode.register
          ? language === Languages.en
            ? "Registration"
            : language === Languages.ua
            ? "Реєстрація"
            : "Регистрация"
          : language === Languages.en
          ? "Forgot your password"
          : language === Languages.ua
          ? "Забули пароль"
          : "Забыли пароль"}
      </h2>
      <p className={classes["auth-form__toggle-message"]}>
        <span>
          {authMode === AuthMode.login
            ? language === Languages.en
              ? "Don't have an account?"
              : language === Languages.ua
              ? "Немає акаунта?"
              : "Нет аккаунта?"
            : language === Languages.en
            ? "Have an account?"
            : language === Languages.ua
            ? "Є акаунт?"
            : "Есть аккаунт?"}
        </span>
        <span className={classes["auth-form__toggler"]} onClick={changeAuthMode}>
          {authMode === AuthMode.login
            ? language === Languages.en
              ? "Register"
              : language === Languages.ua
              ? "Зареєструйтеся"
              : "Зарегистрируйтесь"
            : language === Languages.en
            ? "Login"
            : language === Languages.ua
            ? "Увійти"
            : "Войти"}
        </span>
      </p>
      {authMode === AuthMode.login ? (
        <LoginForm />
      ) : authMode === AuthMode.register ? (
        <RegisterForm goToLoginForm={setAuthModeToLogin} />
      ) : (
        <ForgotPasswordForm />
      )}
      {authMode === AuthMode.login ? (
        <div
          className={classes["auth-form__forgot-password"]}
          onClick={setAuthModeToForgotPassword}
        >
          {language === Languages.en
            ? "Forgot your password?"
            : language === Languages.ua
            ? "Забули пароль?"
            : "Забыли пароль?"}
        </div>
      ) : authMode === AuthMode.register ? (
        <div className={classes["auth-form__register-note"]}>
          {language === Languages.en
            ? "We guarantee that we will NOT share your phone number and email address with third parties."
            : language === Languages.ua
            ? "Заповнення полів з номером телефону та email адресою обов'язкові в зв'язку з законодавством. Ми гарантуємо, що НЕ будемо передавати їх третім особам."
            : "Мы гарантируем, что НЕ будем передавать ваш номер телефона и email адрес третьим лицам."}
        </div>
      ) : (
        <div className={classes["auth-form__forgot-password-note"]}>
          {language === Languages.en
            ? "A new password will be sent to your email."
            : language === Languages.ua
            ? "Новий пароль буде надіслано вам на email."
            : "Новый пароль будет отправлен вам на email."}
        </div>
      )}
    </div>
  );
};

export default AuthForm;
