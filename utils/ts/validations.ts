import validator from "validator";

import { Languages } from "./../../models/language";

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  isTermsAgreed: boolean;
  language: Languages;
}

export interface IRegisterInputErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  phone?: string[];
  checkbox?: string;
}

export interface ILoginData {
  email: string;
  password: string;
  language: Languages;
}

export interface ILoginInputErrors {
  email?: string[];
  password?: string[];
}

export interface IForgotPasswordData {
  email: string;
  language: Languages;
}

export interface IForgotPasswordInputErrors {
  email?: string[];
}

export const registerValidation: (obj: IRegisterData) => IRegisterInputErrors | undefined = ({
  name,
  email,
  phone,
  password,
  isTermsAgreed,
  language
}) => {
  const inputErrors: IRegisterInputErrors = {};

  if (!isTermsAgreed) {
    const errorMsg =
      language === Languages.en
        ? "required field"
        : language === Languages.ua
        ? "обов'язкове поле"
        : "обязательное поле";
    inputErrors.checkbox = errorMsg;
  }

  if (name.trim().length < 1 || name.trim().length > 40) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 50 characters"
        : language === Languages.ua
        ? "від 1 до 50 символів"
        : "от 1 до 50 символов";
    inputErrors.name = inputErrors.name ? [...inputErrors.name, errorMsg] : [errorMsg];
  }

  if (!validator.isEmail(email.trim())) {
    const errorMsg =
      language === Languages.en
        ? "enter valid email"
        : language === Languages.ua
        ? "введіть дійсний email"
        : "введите действительный email";
    inputErrors.email = inputErrors.email ? [...inputErrors.email, errorMsg] : [errorMsg];
  }

  if (!validator.isMobilePhone(phone.trim())) {
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
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (validator.isLowercase(password.trim())) {
    const errorMsg =
      language === Languages.en
        ? "at least 1 capital character"
        : language === Languages.ua
        ? "хоча б 1 заголовний символ"
        : "хотя бы 1 заглавный символ";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (Object.keys(inputErrors).length > 0) {
    return inputErrors;
  }
};

export const loginValidation: (obj: ILoginData) => ILoginInputErrors | undefined = ({
  email,
  password,
  language
}) => {
  const inputErrors: ILoginInputErrors = {};

  if (!validator.isEmail(email.trim())) {
    const errorMsg =
      language === Languages.en
        ? "enter valid email"
        : language === Languages.ua
        ? "введіть дійсний email"
        : "введите действительный email";
    inputErrors.email = inputErrors.email ? [...inputErrors.email, errorMsg] : [errorMsg];
  }

  if (password.trim().length < 5 || password.trim().length > 40) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (validator.isLowercase(password.trim())) {
    const errorMsg =
      language === Languages.en
        ? "at least 1 capital character"
        : language === Languages.ua
        ? "хоча б 1 заголовний символ"
        : "хотя бы 1 заглавный символ";
    inputErrors.password = inputErrors.password ? [...inputErrors.password, errorMsg] : [errorMsg];
  }

  if (Object.keys(inputErrors).length > 0) {
    return inputErrors;
  }
};

export const forgotPasswordValidation: (
  obj: IForgotPasswordData
) => IForgotPasswordInputErrors | undefined = ({ email, language }) => {
  const inputErrors: IForgotPasswordInputErrors = {};

  if (!validator.isEmail(email.trim())) {
    const errorMsg =
      language === Languages.en
        ? "enter valid email"
        : language === Languages.ua
        ? "введіть дійсний email"
        : "введите действительный email";
    inputErrors.email = inputErrors.email ? [...inputErrors.email, errorMsg] : [errorMsg];
  }

  if (Object.keys(inputErrors).length > 0) {
    return inputErrors;
  }
};
