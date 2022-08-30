import { useCallback, useState } from "react";
import { useRouter } from "next/router";

import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";

import { Languages } from "../../models/language";

import classes from "./AuthForm.module.scss";

const AuthForm: React.FC = () => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const [isLogin, setIsLogin] = useState(true);

  const toggleIsLogin = useCallback(() => {
    setIsLogin((prevState) => !prevState);
  }, []);

  return (
    <div className={classes["auth-form"]}>
      <h2 className={classes["auth-form__heading"]}>
        {isLogin
          ? language === Languages.en
            ? "Login"
            : language === Languages.ua
            ? "Вхід"
            : "Вход"
          : language === Languages.en
          ? "Registration"
          : language === Languages.ua
          ? "Реєстрація"
          : "Регистрация"}
      </h2>
      <p className={classes["auth-form__toggle-message"]}>
        <span>
          {isLogin
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
        <span className={classes["auth-form__toggler"]} onClick={toggleIsLogin}>
          {isLogin
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
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthForm;
