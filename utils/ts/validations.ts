import validator from "validator";

import { Languages } from "./../../models/language";

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  language: Languages;
}

export interface IRegisterInputErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  phone?: string[];
}

export const registerValidation: (obj: IRegisterData) => IRegisterInputErrors | undefined = ({
  name,
  email,
  phone,
  password,
  language
}) => {
  const inputErrors: IRegisterInputErrors = {};

  if (name.trim().length < 1 || name.trim().length > 40) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 50 symbols"
        : language === Languages.ua
        ? "від 1 до 50 символів"
        : "от 1 до 50 символов";
    inputErrors.name = inputErrors.name ? [...inputErrors.name, errorMsg] : [errorMsg];
  }

  if (!validator.isEmail(email)) {
    const errorMsg =
      language === Languages.en
        ? "enter valid email"
        : language === Languages.ua
        ? "введіть дійсний email"
        : "введите действительный email";
    inputErrors.email = inputErrors.email ? [...inputErrors.email, errorMsg] : [errorMsg];
  }

  if (!validator.isMobilePhone(phone)) {
    const errorMsg =
      language === Languages.en
        ? "enter valid phone number"
        : language === Languages.ua
        ? "введіть дійсний номер телефону"
        : "введите действительный номер телефона";
    inputErrors.phone = inputErrors.phone ? [...inputErrors.phone, errorMsg] : [errorMsg];
  }

  if (password.trim().length < 5 || password.trim().length > 40) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 40 symbols"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (validator.isLowercase(password)) {
    const errorMsg =
      language === Languages.en
        ? "at least 1 capital symbol"
        : language === Languages.ua
        ? "хоча б 1 заголовний символ"
        : "хотя бы 1 заглавный символ";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (Object.keys(inputErrors).length > 0) {
    return inputErrors;
  }
};
