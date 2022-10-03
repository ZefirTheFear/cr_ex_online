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

export interface IEditUserData {
  newName?: string;
  newEmail?: string;
  newPhone?: string;
  currentPassword?: string;
  newPassword?: string;
  language: Languages;
}

export interface IEditUserInputErrors {
  newName?: string[];
  newEmail?: string[];
  newPhone?: string[];
  currentPassword?: string[];
  newPassword?: string[];
}

export const registerValidation = (inputData: IRegisterData): IRegisterInputErrors | undefined => {
  const inputErrors: IRegisterInputErrors = {};

  const { name, email, phone, password, isTermsAgreed, language } = inputData;

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
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
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

export const loginValidation = (inputData: ILoginData): ILoginInputErrors | undefined => {
  const inputErrors: ILoginInputErrors = {};

  const { email, password, language } = inputData;

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

export const forgotPasswordValidation = (
  inputData: IForgotPasswordData
): IForgotPasswordInputErrors | undefined => {
  const inputErrors: IForgotPasswordInputErrors = {};

  const { email, language } = inputData;

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

export const editUserDataValidation = (
  inputData: IEditUserData
): IEditUserInputErrors | undefined => {
  const inputErrors: IEditUserInputErrors = {};

  const { newName, newEmail, newPhone, currentPassword, newPassword, language } = inputData;

  if (newName !== undefined && (newName.trim().length < 1 || newName.trim().length > 40)) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.newName = inputErrors.newName ? [...inputErrors.newName, errorMsg] : [errorMsg];
  }

  if (newEmail !== undefined && !validator.isEmail(newEmail.trim())) {
    const errorMsg =
      language === Languages.en
        ? "enter valid email"
        : language === Languages.ua
        ? "введіть дійсний email"
        : "введите действительный email";
    inputErrors.newEmail = inputErrors.newEmail ? [...inputErrors.newEmail, errorMsg] : [errorMsg];
  }

  if (newPhone !== undefined && !validator.isMobilePhone(newPhone.trim())) {
    const errorMsg =
      language === Languages.en
        ? "enter valid phone number"
        : language === Languages.ua
        ? "введіть дійсний номер телефону"
        : "введите действительный номер телефона";
    inputErrors.newPhone = inputErrors.newPhone ? [...inputErrors.newPhone, errorMsg] : [errorMsg];
  }

  if (
    currentPassword !== undefined &&
    (currentPassword.trim().length < 5 || currentPassword.trim().length > 40)
  ) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.currentPassword = inputErrors.currentPassword
      ? [...inputErrors.currentPassword, errorMsg]
      : [errorMsg];
  }

  if (currentPassword !== undefined && validator.isLowercase(currentPassword.trim())) {
    const errorMsg =
      language === Languages.en
        ? "at least 1 capital character"
        : language === Languages.ua
        ? "хоча б 1 заголовний символ"
        : "хотя бы 1 заглавный символ";
    inputErrors.currentPassword = inputErrors.currentPassword
      ? [...inputErrors.currentPassword, errorMsg]
      : [errorMsg];
  }

  if (
    newPassword !== undefined &&
    (newPassword.trim().length < 5 || newPassword.trim().length > 40)
  ) {
    const errorMsg =
      language === Languages.en
        ? "from 1 to 40 characters"
        : language === Languages.ua
        ? "від 1 до 40 символів"
        : "от 1 до 40 символов";
    inputErrors.newPassword = inputErrors.newPassword
      ? [...inputErrors.newPassword, errorMsg]
      : [errorMsg];
  }

  if (newPassword !== undefined && validator.isLowercase(newPassword.trim())) {
    const errorMsg =
      language === Languages.en
        ? "at least 1 capital character"
        : language === Languages.ua
        ? "хоча б 1 заголовний символ"
        : "хотя бы 1 заглавный символ";
    inputErrors.newPassword = inputErrors.newPassword
      ? [...inputErrors.newPassword, errorMsg]
      : [errorMsg];
  }

  if (newPassword !== undefined && newPassword === currentPassword) {
    const errorMsg =
      language === Languages.en
        ? "new password must be different"
        : language === Languages.ua
        ? "новий пароль повинен відрізнятися"
        : "новый пароль должен отличаться";
    inputErrors.newPassword = inputErrors.newPassword
      ? [...inputErrors.newPassword, errorMsg]
      : [errorMsg];
  }

  if (Object.keys(inputErrors).length > 0) {
    return inputErrors;
  }
};
