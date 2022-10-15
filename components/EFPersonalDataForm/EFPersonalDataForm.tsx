import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import cloneDeep from "clone-deep";
import Link from "next/link";

import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";
import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import { Languages } from "../../models/language";
import { IEFPersonalDataInputErrors } from "../../utils/ts/validations";

import classes from "./EFPersonalDataForm.module.scss";

enum PersonalDataInputFieldName {
  name = "name",
  email = "email",
  phone = "phone",
  checkbox = "checkbox"
}

interface PersonalDataFormProps {
  proceed: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ proceed }) => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const emailInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const [isTermsAgreed, setIsTermsAgreed] = useState(true);
  const [inputErrors, setInputErrors] = useState<IEFPersonalDataInputErrors>({});

  const toggleCheckbox = useCallback(() => {
    setIsTermsAgreed((prevState) => !prevState);
    const newErrors = cloneDeep(inputErrors);
    delete newErrors["checkbox"];
    setInputErrors(newErrors);
  }, [inputErrors]);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      const fieldName = e.target.name as PersonalDataInputFieldName;
      delete newErrors[fieldName];
      setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const goToNextStep = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div>
      <h3 className={classes["personal-data__heading"]}>
        {language === Languages.en
          ? "Personal Data"
          : language === Languages.ua
          ? "Особисті дані"
          : "Личные данные"}
      </h3>
      <p className={classes["personal-data__paragraph"]}>
        {language === Languages.en
          ? "To save the transaction history and not enter personal data every time, you can "
          : language === Languages.ua
          ? "Щоб зберегти історію транзакцій та не вводити щоразу персональні дані ви можете "
          : "Чтобы сохранить историю транзакций и не вводить каждый раз персональные данные вы можете "}
        <span>
          <Link href={`/${encodeURIComponent(language)}/auth/register`} replace>
            {language === Languages.en
              ? "Register"
              : language === Languages.ua
              ? "Зареєструватися"
              : "Зарегистрироваться"}
          </Link>
        </span>
        {language === Languages.en ? " or " : language === Languages.ua ? " або " : " или "}
        <span>
          <Link href={`/${encodeURIComponent(language)}/auth/login`} replace>
            {language === Languages.en ? "Login" : language === Languages.ua ? "Увійти" : "Войти"}
          </Link>
        </span>
      </p>
      <div>
        <form onSubmit={goToNextStep} noValidate>
          <div className={classes["personal-data__form-row"]}>
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
              name={PersonalDataInputFieldName.name}
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
              name={PersonalDataInputFieldName.email}
              errors={inputErrors.email ? inputErrors.email : null}
              ref={emailInput}
              onFocus={focusInput}
            />
          </div>
          <div className={classes["personal-data__form-row"]}>
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
              name={PersonalDataInputFieldName.phone}
              errors={inputErrors.phone ? inputErrors.phone : null}
              ref={phoneInput}
              onFocus={focusInput}
            />
            <div className={classes["personal-data__terms-group"]}>
              <div className={classes["personal-data__terms"]}>
                <div className={classes["personal-data__checkbox-container"]}>
                  <input
                    type="checkbox"
                    className={
                      `${classes["personal-data__checkbox"]}` +
                      (inputErrors.checkbox ? ` ${classes["personal-data__checkbox_invalid"]}` : ``)
                    }
                    checked={isTermsAgreed}
                    name={PersonalDataInputFieldName.checkbox}
                    onChange={toggleCheckbox}
                  />
                </div>
                <div className={classes["personal-data__terms-text"]}>
                  {language === Languages.en
                    ? "I have read and agree to "
                    : language === Languages.ua
                    ? "Я ознайомлений та згоден з "
                    : "Я ознакомлен и согласен с "}
                  <span className={classes["personal-data__terms-link"]}>
                    <Link href={`/${encodeURIComponent(language)}/terms-and-conditions`}>
                      {language === Languages.en
                        ? "Terms of use"
                        : language === Languages.ua
                        ? "Правилами використання сайту"
                        : "Правилами использования сайта"}
                    </Link>
                  </span>
                  {language === Languages.en ? " and " : language === Languages.ua ? " та " : " и "}
                  <span className={classes["personal-data__terms-link"]}>
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
          </div>
          <div className={classes["personal-data__form-row"]}>
            <button className={classes["personal-data__submit-btn"]} type="submit">
              {language === Languages.en
                ? "Proceed"
                : language === Languages.ua
                ? "Продовжити"
                : "Продолжить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDataForm;
