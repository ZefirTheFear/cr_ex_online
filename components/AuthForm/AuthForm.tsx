import Link from "next/link";
import { useRouter } from "next/router";

import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import ForgotPasswordForm from "../ForgotPasswordForm/ForgotPasswordForm";

import { Languages } from "../../models/language";

import classes from "./AuthForm.module.scss";

export enum AuthMode {
  login = "login",
  register = "register",
  forgotPassword = "forgotPassword"
}

const AuthForm: React.FC = () => {
  const router = useRouter();
  const authMode = router.query.authMode as AuthMode;
  const language = router.query.lang as Languages;

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
        <Link
          href={
            authMode === AuthMode.login
              ? `/${encodeURIComponent(language)}/auth/${encodeURIComponent(AuthMode.register)}`
              : `/${encodeURIComponent(language)}/auth/${encodeURIComponent(AuthMode.login)}`
          }
        >
          <span className={classes["auth-form__toggler"]}>
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
        </Link>
      </p>
      {authMode === AuthMode.login ? (
        <LoginForm />
      ) : authMode === AuthMode.register ? (
        <RegisterForm />
      ) : (
        <ForgotPasswordForm />
      )}
      {authMode === AuthMode.login ? (
        <Link
          href={`/${encodeURIComponent(language)}/auth/${encodeURIComponent(
            AuthMode.forgotPassword
          )}`}
        >
          <div className={classes["auth-form__forgot-password"]}>
            {language === Languages.en
              ? "Forgot your password?"
              : language === Languages.ua
              ? "Забули пароль?"
              : "Забыли пароль?"}
          </div>
        </Link>
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
